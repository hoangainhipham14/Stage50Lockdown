// Project functions
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
;


// Check they are all defined
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
