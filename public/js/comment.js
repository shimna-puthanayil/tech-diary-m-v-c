const newFormHandler = async (event) => {
  event.preventDefault();
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const comment = document.querySelector('#text-comment').value.trim();
  if (comment) {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/post/${id}`);
    } else {
      alert('Failed to save comment');
    }
  }
};

document
  .querySelector('.comment-form')
  .addEventListener('submit', newFormHandler);
let textareaDescription = document.querySelector('#text-description');
// //Calculates the Textarea Height
function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  //// min-height + lines x line-height + padding + border
  let newHeight = 20 + numberOfLineBreaks * 38 + 12 + 2;
  return newHeight;
}

//sets the height of the textArea on size change
function textAreaSize() {
  textareaDescription.style.height =
    calcHeight(textareaDescription.value) + 'px';
  textareaDescription.setAttribute('readonly', true);
  textareaDescription.setAttribute('resize', false);
  textareaDescription.style.height = textareaDescription.scrollHeight;
  textareaDescription.style.height = textareaDescription.scrollHeight;
  textareaDescription.setAttribute('readonly', true);
}
textAreaSize();
new ResizeObserver(textAreaSize).observe(textareaDescription);
