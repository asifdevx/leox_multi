 const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  export const handleCopy = (address:string) => {
    if (!address) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(address)
        .catch(() => fallbackCopy(address));
    } else {
      fallbackCopy(address);
    }
  };