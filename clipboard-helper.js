const copyToClipboard = (text) => {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');

  // Set the value of the textarea to the input text
  textarea.value = text;

  // Add the textarea to the body
  document.body.appendChild(textarea);

  // Select the text inside the textarea
  textarea.select();

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the textarea from the body
  document.body.removeChild(textarea);
};

// Disable warnings for unused parameters in ESLint
/* eslint-disable no-unused-vars */
copyToClipboard();
/* eslint-enable no-unused-vars */
