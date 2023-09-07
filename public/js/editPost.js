//to update a post
const updatePost = async (event) => {
  event.preventDefault();
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  if (id && title && description) {
    const response = await fetch(`/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/dashboard`);
    } else {
      alert('Failed to save post');
    }
  }
};
document.querySelector('#update-post').addEventListener('click', updatePost);
//to delete a post
const deletePost = async (event) => {
  event.preventDefault();
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  if (id && title && description) {
    const response = await fetch(`/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace(`/dashboard`);
    } else {
      alert('Failed to delete post');
    }
  }
};
document.querySelector('#delete-post').addEventListener('click', deletePost);
