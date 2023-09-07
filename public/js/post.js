const newFormHandler = async (event) => {
  event.preventDefault();
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  if (title && description) {
    const response = await fetch(`/`, {
      method: 'POST',
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
document.querySelector('#save-post').addEventListener('click', newFormHandler);
