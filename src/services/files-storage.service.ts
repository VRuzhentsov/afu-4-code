import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import {Capacitor} from "@capacitor/core";

export type DownloadableData = Object | Array<string>;

export default class FilesStorageService {
  async shareFile(fileName: string, data: DownloadableData) {
    await Filesystem.writeFile({
      path: fileName,
      data: JSON.stringify(data),
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });

    const {uri} = await Filesystem.getUri({
      directory: Directory.Cache,
      path: fileName,
    });

    await Share.share({
      // title: fileName,
      // text: fileName,
      url: uri,
      // files: [uri],
    });
  }

  async downloadFile(fileName: string, data: DownloadableData) {
    if (Capacitor.isNativePlatform()) {
      const permissionStatus = await Filesystem.checkPermissions();

      if (permissionStatus.publicStorage !== 'granted') {
        await Filesystem.requestPermissions();
      }

      await Filesystem.writeFile({
        path: fileName,
        data: JSON.stringify(data),
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

    } else {
      // We're running in a browser, so save the file to the app's data directory
      const blob = new Blob([JSON.stringify(data)], {type: "text/json"});
      const link = document.createElement("a");

      link.download = fileName;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(evt);
      link.remove()
    }
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
