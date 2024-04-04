import ora from "ora";
import { invalid, valid } from "../utils.js";
import { apiClient } from "./utils/apiClient.js";

export const setModuleDetails = async (
  id,
  { name, description, searchDescription, acceptanceCriteria }
) => {
  const patchBody = {};

  if (name) {
    patchBody.title = name;
  }
  if (description) {
    patchBody.description = description;
  }
  if (searchDescription) {
    patchBody.search_description = searchDescription;
  }
  if (acceptanceCriteria) {
    patchBody.acceptance_criteria = acceptanceCriteria;
  }
  const patchSpinner = ora(
    "Updating module details."
  ).start();

  const patchResponse = await apiClient.patch({
    path: `/v1/catalog/module/${id}`,
    body: patchBody
  });

  if (patchResponse.ok) {
    valid(`Module details updated for ${id}.`);
  } else {
    invalid(`Unable to update module details for ${id}.`);
  }
  patchSpinner.stop();
};
