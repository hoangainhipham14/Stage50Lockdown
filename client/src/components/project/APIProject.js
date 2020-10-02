//create  a single post view
export const singleProject = (projectId) => {
  return fetch(`/api/project/${projectId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
