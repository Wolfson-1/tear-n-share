export default function formUploadCheck(formData) {
    let errorVal = null;
  
    // loop through form data to verify all fields are filled (-1 to not check submit button)
    for (let i = 0; i < formData.length - 1; i++) {
      let dataTest = formData[i].value;
  
      if (dataTest === "" || dataTest === null) {
        errorVal = "Please fill in all fields to register an account.";
        formData = null;
        return { errorVal, formData };
      }
    }
  
    return { errorVal, formData };
  };