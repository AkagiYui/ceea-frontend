<script setup lang="ts">
import {
  NH1,
  NH2,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NScrollbar,
  NLayoutContent,
  NButton,
  NH3,
  NInput,
  NSpace,
  NIcon,
  NCard,
  NDivider,
  NRadio,
  NRadioGroup,
  NCheckbox,
  NCheckboxGroup,
  type InputInst,
} from "naive-ui";
import { Save20Filled } from "@vicons/fluent";
import { HomeTwotone } from "@vicons/antd";
import { useRoute } from "vue-router";
import { getSurveyDetail } from "@/utils/api";
import { onMounted, ref, watch, onBeforeUnmount } from "vue";

interface QuestionType {
  id: string;
  name: string;
}

interface Question {
  id: string;
  type: string;
  content: string;
  selections: { id: string; content: string }[];
}

interface SurveyInfo {
  id: string;
  title: string;
  description: string;
  password: string;
  questionTypes: QuestionType[];
  questions: Question[];
}

const route = useRoute();
const surveyId = route.query.id as string;
const editingTitle = ref(false);
const inputInstRef = ref<InputInst | null>(null);
const questionTypeMenu = ref<QuestionType[]>([]);
const survey = ref<SurveyInfo>({
  id: "",
  title: "",
  description: "",
  password: "",
  questionTypes: [],
  questions: [],
});

function getSurvey() {
  getSurveyDetail(surveyId).then((r) => {
    const { data } = r.data;
    survey.value = data as SurveyInfo;
    questionTypeMenu.value = survey.value.questionTypes;
  });
}

function addQuestion(type: QuestionType) {
  const question = {
    id: "",
    type: type.id,
    content: type.name,
    selections: [],
  };
  survey.value.questions.push(question as Question);
}

watch(editingTitle, (val) => {
  if (!val) {
    checkTitle();
  } else {
    // inputInstRef.value?.focus();
    // inputInstRef.value?.select();
  }
});

function checkTitle() {
  if (survey.value.title === "") {
    survey.value.title = "请输入标题";
  }
}

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  e.returnValue = "";
}

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", beforeUnloadHandler);
});

onMounted(() => {
  window.addEventListener("beforeunload", beforeUnloadHandler);
  getSurvey();
});
</script>

<template>
  <main>
    <NLayout>
      <NLayoutHeader
        bordered
        style="display: flex; height: 60px; margin-left: 30px"
      >
        <div style="flex: 1; padding-top: 15px">
          <NSpace>
            <NButton secondary type="default">
              <template #icon>
                <NIcon><HomeTwotone /></NIcon>
              </template>
            </NButton>
            <NDivider vertical />
            <NButton type="info">
              <template #icon>
                <NIcon><Save20Filled /></NIcon>
              </template>
              保存
            </NButton>
            <div style="margin: 1px 0 0 20px">
              <NH3
                bodered
                v-if="!editingTitle"
                style="display: inline-block"
                @click="editingTitle = true"
              >
                {{ survey?.title }}
              </NH3>
              <NInput
                v-if="editingTitle"
                autofocus
                autosize
                show-count
                type="text"
                width="auto"
                ref="inputInstRef"
                v-model:value="survey.title"
                placeholder="请输入标题"
                @blur="editingTitle = false"
              />
            </div>
          </NSpace>
        </div>
        <!-- TODO: 按钮居右显示 -->
        <NButton secondary type="error">
          <template #icon>
            <NIcon><HomeTwotone /></NIcon>
          </template>
        </NButton>
      </NLayoutHeader>
      <NLayout has-sider bordered>
        <NLayoutSider bordered :width="200">
          <NSpace vertical style="margin-top: 20px">
            <NH3 style="text-align: center">点击添加到问卷</NH3>
            <NButton
              secondary
              v-for:="i in questionTypeMenu"
              size="large"
              style="width: 180px; margin: 0 10px 0 10px"
              @click="addQuestion(i)"
            >
              {{ i.name }}
            </NButton>
          </NSpace>
        </NLayoutSider>
        <NSpace vertical>
          <NScrollbar class="scro">
            <NLayoutContent
              :style="{
                margin: '30px',
              }"
            >
              <NSpace vertical>
                <NCard>
                  <NSpace vertical>
                    <NSpace>
                      <span>问卷标题</span>
                      <NInput
                        show-count
                        v-model:value="survey.title"
                        placeholder="请输入标题"
                        @blur="checkTitle"
                      />
                    </NSpace>
                    <NSpace>
                      <span>问卷描述</span>
                      <NInput
                        show-count
                        rows="1"
                        type="textarea"
                        v-model:value="survey.description"
                        placeholder="请输入描述"
                      />
                    </NSpace>
                  </NSpace>
                </NCard>
                <NCard v-for:="i of survey.questions">
                  <NSpace vertical>
                    <NH2>{{ i.content }}</NH2>
                    <NRadioGroup
                      v-if="i.type === '1' && i.selections.length > 0"
                      name="radiogroup"
                    >
                      <NSpace vertical>
                        <NRadio
                          v-for:="j of i.selections"
                          :value="j.id"
                          :label="j.content"
                        />
                      </NSpace>
                    </NRadioGroup>
                    <NCheckboxGroup
                      v-else-if="i.type === '2' && i.selections.length > 0"
                      name="CheckboxGroup"
                    >
                      <NSpace vertical>
                        <NCheckbox
                          v-for:="j of i.selections"
                          :value="j.id"
                          :label="j.content"
                        />
                      </NSpace>
                    </NCheckboxGroup>
                    <NInput v-else-if="Number(i.type) >= 3" />
                    <NButton v-if="i.type <= '2'">+ 添加选项</NButton>
                  </NSpace>
                </NCard>
                <NH1>{{ survey }}</NH1>
              </NSpace>
            </NLayoutContent>
          </NScrollbar>
        </NSpace>
      </NLayout>
    </NLayout>
  </main>
</template>

<style>
.scro {
  max-height: calc(100vh - 60px);
  min-height: calc(100vh - 60px);
}
</style>
