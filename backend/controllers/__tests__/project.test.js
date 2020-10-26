const {
  createProject,
  singleProject,
  projectById,
  image,
  ProjectList,
  toggleProjectPrivacy,
  generateProjectLink,
  connectLinkToProject,
} = require("../project");

//const regeneratorRuntime = require("regenerator-runtime");

//const server = require("../../server");
const { expect } = require("chai");

// In future would be able to test all the functions independantly whilst running the server

describe("Project Validation Tests -> Check the files exist", function () {
  it("should recognise all the functions exist", function () {
    expect(createProject);
    expect(projectById);
    expect(image);
    expect(singleProject);
    expect(ProjectList);
    expect(toggleProjectPrivacy);
    expect(generateProjectLink);
    expect(connectLinkToProject);
  });
});
