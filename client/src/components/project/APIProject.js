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

// Same principle but it returns the data based on the 
// link referenced rather than the projectId

export const connectLinkToProject = (link) => {
  return fetch(`/api/project/link/${link}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};