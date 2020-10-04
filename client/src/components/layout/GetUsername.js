export const getUsernameId = (id) => {
  return fetch(`/api/userId/${id}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
