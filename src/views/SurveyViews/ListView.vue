<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import {
  NButton,
  NSpace,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  type FormInst,
  type PaginationProps,
} from "naive-ui";
import { useStatusStore } from "@/stores/status";
import { useRouter } from "vue-router";
import {
  getSurveyList,
  setSurveyActive,
  createSurvey,
  deleteSurvey,
} from "@/utils/api";

interface SurveyPage {
  pageCount: number;
  data: [];
  total: number;
}

interface SurveyInfo {
  id: string;
  title: string;
  description: string;
  password: string;
  isActive: boolean;
  submitCount: number;
  createTime: string;
  switching: boolean;
}

interface SurveyPageRaw {
  records: [];
  total: number;
  size: number;
  pages: number;
  current: number;
}

const router = useRouter();
const status = useStatusStore(); // 记录分页大小
const loadingRef = ref(true); // 加载动画
const dataRef = ref([]); // 表格数据

function createOneSurvey() {
  window.$loadingBar.start();
  createSurvey()
    .then((r) => {
      const { data: res } = r;
      if (res.code === 200) {
        openSurvey(res.data as string);
        window.$message.success(res.data as string);
        window.$loadingBar.finish();
        displayData();
      } else {
        throw new Error(res.msg);
      }
    })
    .catch((e) => {
      window.$message.error(e);
      window.$loadingBar.error();
    });
}

function openSurvey(id: string) {
  const route = router.resolve({ name: "survey-edit", query: { id } });
  window.open(route.href, "_blank");
}

function deleteOneSurvey(row: SurveyInfo) {
  window.$dialog.warning({
    title: "警告",
    content: `是否删除 ${row.title} ？删除后不可恢复！`,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      window.$loadingBar.start();
      deleteSurvey(row.id)
        .then((r) => {
          const { data: res } = r;
          if (res.code === 200) {
            window.$loadingBar.finish();
            displayData();
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((e) => {
          window.$message.error(e);
          window.$loadingBar.error();
        });
    },
  });
}

// 顶部搜索表单
const formRef = ref<FormInst | null>(null);
const formValue = ref({
  keyword: "",
});
function handleSearch(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      window.$message.success("Valid");
    } else {
      console.log(errors);
      window.$message.error("Invalid");
    }
  });
}

// 底部分页组件
const pageSizes: { label: string; value: number }[] = (() => {
  const arr = [];
  for (const i of [2, 5, 10, 20, 50, 100]) {
    arr.push({
      label: `每页 ${i} 项`,
      value: i,
    });
  }
  return arr;
})();
const paginationReactive = reactive({
  page: 1, // 当前页
  pageCount: 1, // 总页数
  pageSize: status.pageSize, // 每页相数
  pageSizes: pageSizes, // 可选相数
  showSizePicker: true, // 显示每页相数选择器
  itemCount: 0, // 总数
  prefix(iC: { itemCount: number }) {
    // 前缀
    return `共 ${iC.itemCount} 项`;
  },
});
// 分页大小改变
function handlePageSizeChange(pageSize: number) {
  paginationReactive.pageSize = pageSize;
  status.pageSize = pageSize;
  paginationReactive.page = 1;
  handlePageChange(1);
}

// 表头字段
const columnsRef = ref([
  {
    title: "标题",
    key: "title",
  },
  {
    title: "描述",
    key: "description",
  },
  {
    title: "提交次数",
    key: "submitCount",
    width: 100,
  },
  {
    title: "状态",
    key: "isActive",
    width: 140,
    render(row: SurveyInfo) {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          disable: row.switching,
          size: "small",
          type: row.isActive ? "success" : "error",
          onClick: () => setActive(row),
        },
        { default: () => (row.isActive ? "已发布" : "未发布") }
      );
    },
  },
  {
    title: "操作",
    key: "action",
    width: 180,
    render(row: SurveyInfo) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                type: "primary",
                onClick: () => openSurvey(row.id),
              },
              { default: () => "查看" }
            ),
            h(
              NButton,
              {
                size: "small",
                type: "error",
                onClick: () => deleteOneSurvey(row),
              },
              { default: () => "删除" }
            ),
          ],
        }
      );
    },
  },
]);

function setActive(row: SurveyInfo) {
  row.switching = true;
  window.$loadingBar.start();
  setSurveyActive(row.id, !row.isActive)
    .then((res) => {
      if (res.data.code === 200) {
        row.isActive = !row.isActive;
        window.$loadingBar.finish();
      } else {
        throw new Error(res.data.msg);
      }
    })
    .catch(() => {
      window.$message.error("操作失败");
      window.$loadingBar.error();
    })
    .finally(() => {
      row.switching = false;
    });
}

// 每行记录的Key的生成
function rowKey(rowData: SurveyInfo) {
  return rowData.id;
}

// 获取当前页数据
function query(page: number, pageSize = 10, reverse = false) {
  return new Promise((resolve) => {
    getSurveyList(page, pageSize).then((r) => {
      const { data } = r;
      const res = data.data as SurveyPageRaw;
      const records = res.records;
      if (reverse) {
        records.reverse();
      }
      resolve({
        pageCount: res.pages,
        data: records,
        total: res.total,
      } as SurveyPage);
    });
  });
}

// 页码改变
function handlePageChange(currentPage: number) {
  if (!loadingRef.value) {
    loadingRef.value = true;
    query(currentPage, paginationReactive.pageSize).then((data) => {
      const res = data as SurveyPage;
      dataRef.value = res.data;
      paginationReactive.page = currentPage;
      paginationReactive.pageCount = res.pageCount;
      paginationReactive.itemCount = res.total;
      loadingRef.value = false;
    });
  }
}

function displayData() {
  query(paginationReactive.page, paginationReactive.pageSize).then((data) => {
    const res = data as SurveyPage;
    dataRef.value = res.data;
    paginationReactive.pageCount = res.pageCount;
    paginationReactive.itemCount = res.total;
    loadingRef.value = false;
  });
}

onMounted(() => {
  displayData();
});
</script>

<template>
  <NSpace vertical>
    <NForm
      style="margin-top: 5px"
      :show-label="false"
      ref="formRef"
      inline
      :model="formValue"
    >
      <NFormItem>
        <NSpace>
          <NButton attr-type="button" type="primary" @click="createOneSurvey">
            创建问卷
          </NButton>
          <NButton attr-type="button" type="info" @click="handlePageChange(1)">
            刷新
          </NButton>
        </NSpace>
      </NFormItem>
      <NFormItem path="keyword">
        <NInput v-model:value="formValue.keyword" placeholder="输入关键字" />
      </NFormItem>
      <NFormItem>
        <NButton attr-type="button" @click="handleSearch"> 搜索 </NButton>
      </NFormItem>
    </NForm>
    <NDataTable
      remote
      striped
      ref="table"
      :columns="columnsRef"
      :data="dataRef"
      :loading="loadingRef"
      :pagination="(paginationReactive as PaginationProps)"
      :row-key="rowKey"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </NSpace>
</template>

<style></style>
