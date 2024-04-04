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

  const patchSpinner = ora(
    "Updating module details."
  ).start();

  try {
    const patchResponse = await apiClient.patch({
      path: `/v1/catalog/module/${id}`,
      body: patchBody
    });

    if (patchResponse.ok) {
      patchSpinner.stop();
      valid(`Module details updated for ${id}.`);
    } else {
      patchSpinner.stop();
      invalid(`Unable to update module details for ${id}. Please try again.`);
    }
  } catch (error) {
    invalid(`An error occurred: ${error.message}. Please try again.`);
  }
};
