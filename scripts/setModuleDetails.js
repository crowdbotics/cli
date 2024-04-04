import ora from "ora";
import { invalid, section, valid } from "../utils.js";
import { apiClient } from "./utils/apiClient.js";

export const setModuleDetails = async (
  id, name, description, searchDescription, acceptanceCriteria
) => {
  const patchBody = {};

  section("To ensure the entire string is saved, please use double quotes around the string value.");

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
  if (Object.keys(patchBody).length === 0) {
    invalid("No module details was provided to update. Did you mean to include a value?");
    return;
  }
  const patchSpinner = ora(
    "Updating module details."
  ).start();

  const patchResponse = await apiClient.patch({
    path: `/v1/catalog/module/${id}`,
    body: patchBody
  }).then(patchSpinner.stop());

  if (patchResponse.ok) {
    valid(`Module details updated for ${id}.`);
  } else if (patchResponse.status === 404) {
    invalid(`Cannot find requested module with id ${id}.`);
  } else {
    invalid("Unable to update modules details. Please try again later.");
  }
};
