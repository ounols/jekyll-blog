---
title: LibrePods - AirPods를 애플 생태계에서 해방시키다
description: AirPods의 독점 기능들을 Android와 Linux에서 사용할 수 있게 해주는 오픈소스 프로젝트
author: claude
date: '2025-11-18 09:09:58'
categories:
  - News Articles
tags:
  - Android
  - Linux
  - Bluetooth
  - AirPods
  - Open Source
  - Xposed
pin: false
math: false
mermaid: false
hidden: true
---

**프로젝트 링크**: [LibrePods](https://github.com/kavishdevar/librepods){: target="_blank"}

![LibrePods Banner](/media/2025-11-18-librepods/figure-1.png)

AirPods를 구매했지만 Android 폰이나 Linux 데스크톱에서는 제한된 기능만 사용할 수 있다는 사실에 실망한 적이 있으신가요? LibrePods는 바로 이 문제를 해결하기 위해 만들어진 오픈소스 프로젝트입니다. **애플이 자사 생태계에만 제공하는 AirPods의 프리미엄 기능들을 비애플 기기에서도 사용**할 수 있게 해줍니다.

## LibrePods가 가능하게 하는 것들

LibrePods를 사용하면 다음과 같은 기능들을 Android나 Linux 기기에서 사용할 수 있습니다.

### 1. 노이즈 컨트롤 모드 전환

AirPods를 손으로 길게 누르지 않아도 앱에서 바로 노이즈 캔슬링, 투명 모드, 일반 모드를 전환할 수 있습니다.

### 2. 자동 귀 감지

AirPods를 귀에 넣거나 빼면 자동으로 음악이 재생되거나 정지됩니다. 또한 AirPods를 빼면 자동으로 폰 스피커로 오디오가 전환됩니다.

### 3. 정확한 배터리 상태

각 이어폰과 충전 케이스의 배터리 잔량을 정확하게 확인할 수 있습니다.

### 4. 헤드 제스처

고개를 끄덕이거나 저으면 전화를 받거나 거절할 수 있습니다.

### 5. 대화 인식

사용자가 말을 시작하면 자동으로 볼륨이 낮아져 주변 대화를 더 잘 들을 수 있습니다.

### 6. 보청기 기능

청력 검사 결과(오디오그램)를 입력하여 개인 맞춤형 보청기 기능을 사용할 수 있습니다.

### 7. 투명 모드 커스터마이징

증폭, 균형, 톤, 대화 부스트, 주변 소음 감소 등을 세밀하게 조정할 수 있습니다.

### 8. 멀티 디바이스 연결

최대 2개의 기기에 동시 연결하여 끊김 없이 전환할 수 있습니다.

## 지원 기기

LibrePods는 다양한 AirPods 모델을 지원합니다.

| 상태 | 기기 | 지원 기능 |
|-----|------|----------|
| ✅ | AirPods Pro (2세대) | 완전 지원 및 테스트 완료 |
| ✅ | AirPods Pro (3세대) | 완전 지원 (심박수 모니터링 제외) |
| ✅ | AirPods Max | 완전 지원 (일부 미지원 기능 표시) |
| ⚠️ | 기타 AirPods 모델 | 기본 기능 (배터리, 귀 감지) 작동 가능 |

개발자가 현재 AirPods Pro 2세대만 보유하고 있어 완전한 테스트는 해당 모델에 집중되어 있지만, 대부분의 기능은 다른 AirPods 모델에서도 작동할 것으로 예상됩니다.

## 플랫폼 지원

### Android

Android 버전이 가장 많은 기능을 지원하며, 다양한 스크린샷과 데모 비디오가 제공되고 있습니다.

![Settings Screenshot](/media/2025-11-18-librepods/figure-2.png)

![Notification and Quick Settings](/media/2025-11-18-librepods/figure-3.png)

![Head Tracking and Gestures](/media/2025-11-18-librepods/figure-4.png)

### Linux

Linux 버전은 현재 개발 중이며, 기존 버전은 기능이 제한적입니다. 새로운 버전이 PR #241에서 개발되고 있습니다.

## Root와 Xposed 요구사항

> ColorOS/OxygenOS 16을 사용하는 경우 기본 기능은 루트 없이 사용할 수 있습니다. 하지만 투명 모드 커스터마이징, 보청기 설정, Bluetooth Multipoint는 여전히 사용할 수 없습니다.
{: .prompt-info}

> Android Bluetooth 스택의 버그로 인해 대부분의 사용자는 Xposed가 설치된 루팅된 기기가 필요합니다. Google이 이 문제를 수정할 때까지는 루트 요구사항에 예외가 없습니다.
{: .prompt-warning}

## Bluetooth DID Hook으로 가능해지는 추가 기능

LibrePods는 Bluetooth DID(Device Identification)의 제조사 ID를 애플로 변경하여 특별한 기능들을 활성화합니다.

### 멀티 디바이스 연결

최대 2개의 기기가 AirPods에 동시 연결되어 오디오와 제어를 모두 사용할 수 있습니다. 다른 기기가 AirPods를 가져가면 Android에도 애플 기기처럼 "Move to iPhone" 팝업이 표시됩니다.

### 접근성 및 보청기 설정

투명 모드의 증폭, 균형, 톤, 대화 부스트, 주변 소음 감소를 Android에서 직접 설정할 수 있습니다. 보청기 커스터마이징도 모두 가능하며, 오디오그램 결과를 입력할 수 있습니다.

> 청력 검사는 높은 정밀도가 필요하므로 앱에서 직접 제공하지 않습니다. 기존의 오디오그램 결과를 사용하는 것을 권장합니다.
{: .prompt-tip}

이 기능들을 활성화하려면 앱 설정에서 "act as Apple Device"를 활성화해야 합니다.

## 알아두어야 할 사항

몇 가지 제한사항과 주의사항이 있습니다.

**펌웨어 업데이트 후 Off 모드 활성화**: 최근 AirPods 펌웨어 업그레이드 이후, Off 모드로 전환하려면 "Off listening mode"를 활성화해야 합니다. 이 모드에서는 큰 소리 감소 기능이 비활성화됩니다.

**자동 연결 재시도 문제**: 두 AirPods를 모두 빼면 앱이 자동으로 폰 스피커로 전환하지만, Android는 여전히 Bluetooth 연결을 시도할 수 있습니다. 앱은 귀에서 빼진 상태에서 Android가 다시 연결을 시도하면 즉시 A2DP 프로필을 끊도록 설계되어 있습니다.

**이름 변경 후 재페어링 필요**: 앱을 통해 AirPods 이름을 변경하면, Android 설정에 반영되려면 재페어링이 필요합니다. 이는 Android의 Bluetooth 기기 이름 처리 방식의 제한사항입니다.

**시스템 앱 설치 권장**: Android 설정 앱에 AirPods 아이콘과 배터리 상태를 표시하려면, 루트 모듈을 사용하여 앱을 시스템 앱으로 설치해야 합니다.

## 프로젝트의 성장

LibrePods는 오픈소스 커뮤니티에서 빠르게 주목받고 있으며, GitHub 스타 수가 꾸준히 증가하고 있습니다.

![Star History](/media/2025-11-18-librepods/figure-5.svg)

## 마치며

LibrePods는 **애플의 폐쇄적인 생태계에 대한 실용적인 대안**을 제시합니다. AirPods를 구매하면서 지불한 하드웨어 기능을 모든 플랫폼에서 활용할 수 있도록 해주는 이 프로젝트는, 사용자가 자신의 기기를 진정으로 소유한다는 것이 무엇인지를 보여줍니다.

루트와 Xposed가 필요하다는 점은 일반 사용자에게 진입 장벽이 될 수 있지만, 그만큼의 가치가 있는 프로젝트입니다. 특히 AirPods Pro 2세대 사용자이면서 Android를 메인 기기로 사용하는 분들에게는 필수적인 도구가 될 것입니다.

프로젝트는 GNU General Public License v3 하에 배포되며, 커뮤니티의 기여를 환영하고 있습니다. XDA Forums에도 스레드가 개설되어 있어 사용자들과 활발히 소통하고 있습니다.

## Quick questions

> **ColorOS/OxygenOS 16이 아닌 다른 Android 기기에서 루트 없이 사용할 수 있나요?**
>
> 현재는 불가능합니다. Android Bluetooth 스택의 버그로 인해 ColorOS/OxygenOS 16을 제외한 모든 기기에서 Xposed가 설치된 루팅된 기기가 필요합니다.
{: .prompt-info}

> **Linux 버전은 언제 완성되나요?**
>
> 새로운 Linux 버전이 PR #241에서 개발 중입니다. 기존 버전은 기능이 제한적이므로 새 버전 출시를 기다리는 것을 권장합니다.
{: .prompt-info}

> **AirPods Max도 모든 기능을 지원하나요?**
>
> AirPods Max는 완전히 지원되지만, 클라이언트에서 일부 미지원 기능이 표시될 수 있습니다. 대부분의 주요 기능은 정상적으로 작동합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}
