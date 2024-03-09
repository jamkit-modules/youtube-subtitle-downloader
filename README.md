# youtube-subtitle-downloader

유튜브 비디오의 캡션을 다운로드하는 모듈

## Examples

#### sbml
```sbml
=object sbml: id=sbml.youtube, style=sbml_youtube
```

#### sbss
```sbss
#sbml_youtube {
  width: 1pw;
  height: 1ph;
  position: absolute;
  gravity: center;
  hidden: yes;
}
```

#### js
```js
const subtitle = require("youtube-subtitle-downloader").initialize("sbml.youtube");

subtitle.download("ArmDp-zijuc")
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
```

## Prerequisites

- [webjs-helper](https://github.com/jamkit-modules/webjs-helper) 
- [srt-parser](https://github.com/jamkit-modules/srt-parser) 

## API References

#### `initialize(sbml_id)`

- **Parameters**:
  - `sbml_id` (string) - 유튜브 비디오 캡션 다운로드에 사용되는 웹뷰를 호스팅할 sbml 오브젝트의 ID

- **Returns**: `module` - 초기화한 모듈 자체의 인스턴스 

#### `download(video_id, options)`

- **Parameters**:
  - `video_id` (string) - 캡션을 다운로드할 유튜브 비디오의 ID
  - `options` (DownloadOptions, optional) - 캡션 다운로드 시에 적용할 옵션 

- **DownloadOptions**:
  - `url-only` (boolean, default=false) - true일 경우, 유튜브 캡션 SRT 파일의 URL을 리턴함.
  - `srt-only` (boolean, default=false) - true일 경우, 유튜브 캡션 SRT 데이터를 리턴함.

- **Returns**: `Promise<Array<Caption> | string>` - 비디오 캡션(`Caption`) 객체의 배열 혹은 문자열(URL, SRT 데이터)을 전달하는 `Promise`

- **Caption**:
  - `number` (string) - 캡션 번호
  - `begin-time` (string) - 캡션의 시작 시간. HH:MM:DD.SSS 형식
  - `end-time` (string) - 캡션의 끝 시간. HH:MM:DD.SSS 형식
  - `caption` (string) - 캡션 내용
