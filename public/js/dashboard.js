const addNewPost = async (event) => {
  event.preventDefault();
  document.location.replace('/addnewpost');
};

document.querySelector('#add-post').addEventListener('click', addNewPost);
