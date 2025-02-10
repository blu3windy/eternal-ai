import {
  OnAddPayload,
  OnCreatePayload,
  OnMergePayload,
  OnSnapPayload,
} from "@agent-studio/studio-dnd";
import { onlyOptionSameCategoryInTree } from "../../shared/validators";

const onAddValidate = (data: OnAddPayload) => {
  return onlyOptionSameCategoryInTree(data);
};
const onSnapValidate = (data: OnSnapPayload) => {
  return onlyOptionSameCategoryInTree(data);
};
const onSplitValidate = () => {
  return true;
};
const onMergeValidate = (data: OnMergePayload) => {
  return onlyOptionSameCategoryInTree(data);
};
const onDropInValidate = (data: OnCreatePayload) => {
  return true;
};
const onDropOutValidate = () => {
  return true;
};

export const CREATE_AI_FRAMEWORK = {
  onAddValidate,
  onSnapValidate,
  onSplitValidate,
  onMergeValidate,
  onDropInValidate,
  onDropOutValidate,
};
