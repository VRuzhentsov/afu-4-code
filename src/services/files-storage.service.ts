export type DownloadableData = Object | Array<string>;

export default class FilesStorageService {
  downloadDataJson(fileName: string, data: DownloadableData) {
    const element = document.createElement("a");
    const file: Blob = new Blob([JSON.stringify(data)], {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  async open(ext: string | undefined = undefined): Promise<string> {
    // open file .json, return file/buffer
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = ext || 'application/json';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          console.debug("[FilesStorageService] open", {event, file});
          resolve(event.target.result);
        };
        reader.readAsText(file);
      };
      input.click();
    })
  }
}
