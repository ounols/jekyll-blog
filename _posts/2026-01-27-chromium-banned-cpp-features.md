---
title: Chromium에서 금지된 C++ 기능들 - 최신 표준을 선별 적용하는 이유
description: Chromium 프로젝트가 C++11부터 C++23까지의 최신 표준 기능을 어떻게 선별하고 금지하는지, 그리고 그 기준과 대안에 대해 알아봅니다.
author: claude
date: '2026-01-27 09:00:00'
categories:
  - News Articles
tags:
  - C++
  - Chromium
  - Coding Standards
  - Software Engineering
  - Code Quality
pin: false
math: false
mermaid: false
hidden: true
---

**원본 링크**: [Chromium에서 금지된 C++ 기능들](https://news.hada.io/topic?id=26113){:target="_blank"}

![Chromium Logo](/media/2026-01-27-chromium-banned-cpp-features/figure-1.png)

Chromium 프로젝트는 세계에서 가장 널리 사용되는 웹 브라우저 중 하나인 Chrome의 오픈소스 기반입니다. 수백만 줄의 C++ 코드로 이루어진 이 거대한 프로젝트는 최신 C++ 표준 기능을 무조건 수용하지 않고, **빌드 안정성, 보안, 성능, 코드 일관성을 기준으로 선별 적용**하는 독특한 정책을 유지하고 있습니다.

## Chromium의 Modern C++ 사용 정책

Chromium은 최신 C++ 표준이 출시되더라도 즉시 도입하지 않습니다. 대신 도구체인 지원이 충분히 확보된 후에야 '초기 지원(initially supported)' 상태로 지정하며, 이후 각 기능을 개별적으로 검토합니다.

**기능 분류 프로세스는 세 가지 상태로 구분**됩니다. 허용(allowed), 금지(banned), 검토 중(TBD)으로 나뉘며, 새로운 기능의 상태 변경은 cxx@chromium.org 메일링 리스트를 통해 제안할 수 있습니다. 특히 초기 지원 후 2년이 지나면 명시적 검토를 거쳐 허용 또는 금지 목록으로 이동하게 됩니다.

현재 Chromium은 C++23을 타겟으로 하고 있으며, 이는 Google 스타일 가이드가 C++20을 타겟으로 하는 것과 차이가 있습니다.

## C++11 금지 기능 - 중복 구현 문제

C++11은 현대적 C++의 시작점으로 평가받지만, Chromium에서는 여러 기능이 금지되어 있습니다.

### 1. 언어 기능 금지 항목

**inline namespace, long long, 사용자 정의 리터럴(user-defined literals)**이 금지되었습니다. 이들은 코드 가독성 저하나 호환성 문제를 일으킬 수 있기 때문입니다.

### 2. 라이브러리 기능 금지 항목

가장 주목할 만한 점은 `std::shared_ptr`, `std::weak_ptr`, `std::bind`, `std::function` 같은 널리 사용되는 기능들이 금지되었다는 것입니다. Chromium은 이미 자체 구현체인 `base::RefCounted`, `base::Bind`, `base::Callback`을 가지고 있으며, 표준 라이브러리와의 혼용은 코드 일관성을 해칩니다.

> Chromium은 표준 라이브러리 대신 자체 base 네임스페이스 구현체를 사용하여 코드베이스 전체의 일관성을 유지합니다. 이는 수백만 줄의 레거시 코드와의 호환성을 보장하기 위한 전략입니다.
{: .prompt-info}

또한 `<chrono>`, `<regex>`, `<random>` 엔진, `<exception>`, `<ratio>`, `<thread>` 등의 라이브러리가 금지되었습니다. 이들은 모두 Chromium의 base 라이브러리에서 제공하는 대체 구현체가 존재합니다.

**예외(exception)는 완전히 비활성화**되어 있으며, `noexcept` 지정자만 허용됩니다. 이는 성능과 바이너리 크기 최적화를 위한 결정입니다.

## C++17 금지 기능 - 호환성 문제

C++17에서도 여러 기능이 금지되었는데, 특히 UTF-8 관련 기능과 병렬 처리 기능이 주목할 만합니다.

### UTF-8 문자 리터럴과 char8_t

**UTF-8 문자 리터럴(u8)과 char8_t가 금지**되었습니다. 이는 기존 코드에서 `u8` 리터럴이 `const char*`를 반환했지만, C++20부터는 `const char8_t*`를 반환하면서 발생하는 호환성 문제 때문입니다.

### 라이브러리 금지 항목

수학 특수함수, 병렬 알고리듬(parallel algorithms), `std::any`, `std::byte`, `std::filesystem`, `std::pmr` 메모리 리소스 등이 금지되었습니다.

> 병렬 알고리듬은 libc++에서 아직 지원하지 않으며, Chrome의 자체 스레딩 모델과 충돌할 우려가 있어 금지되었습니다.
{: .prompt-warning}

`std::filesystem`의 경우 플랫폼 간 일관성 문제와 보안 취약점 우려로 금지되었으며, Chromium은 자체 파일 시스템 추상화 레이어를 사용합니다.

## C++20 허용 및 금지 기능 - 선별적 도입

C++20은 개념(concepts)과 코루틴(coroutines) 같은 혁신적인 기능을 도입했지만, Chromium은 매우 신중하게 접근하고 있습니다.

### 허용된 언어 기능

**concepts, consteval, designated initializers, spaceship 연산자(&#60;=>), [[likely]] 속성, range-for 초기화 구문**이 허용되었습니다. 이들은 코드 안전성과 가독성을 크게 향상시키면서도 기존 코드베이스와의 충돌이 적기 때문입니다.

특히 concepts는 템플릿 제약을 명확하게 표현할 수 있어 컴파일 에러 메시지를 개선하고, designated initializers는 구조체 초기화를 더욱 명확하게 만듭니다.

### 허용된 라이브러리 기능

`<bit>`, `<compare>`, `<concepts>`, `<numbers>`, `std::erase_if`, `std::ranges::subrange`, `std::to_underlying` 등이 허용되었습니다. **std::ranges의 일부 알고리듬도 허용**되었는데, 이는 반복자 기반 코드를 더욱 안전하고 간결하게 만들어줍니다.

### 금지된 기능

**char8_t, modules, [[no_unique_address]] 속성, std::bit_cast, &#60;span>, std::bind_front, std::ranges::view_interface**가 금지되었습니다.

modules는 빌드 시스템과의 통합이 아직 불완전하고, `<span>`은 Chromium이 이미 `base::span`을 사용하고 있기 때문입니다.

### 검토 중(TBD) 기능

**coroutine, &#60;format>, &#60;source_location>, std::u8string**은 여전히 검토 중입니다. 코루틴은 강력하지만 복잡도가 높고, `<format>`은 바이너리 크기 증가 우려가 있어 신중하게 평가되고 있습니다.

## C++23 허용 및 검토 기능 - 최신 표준

C++23은 2026년 1월에 초기 지원 상태로 지정되었으며, 일부 기능은 이미 허용되었습니다.

### 허용된 언어 기능

`#elifdef`, `if consteval`, 정적 연산자(static operator)가 허용되었습니다. 이들은 비교적 단순하면서도 유용한 기능들입니다.

### 허용된 라이브러리 기능

**std::byteswap, std::basic_string::contains, std::to_underlying, std::ranges 확장 알고리듬**이 허용되었습니다. 특히 `std::basic_string::contains`는 문자열 검색을 더욱 직관적으로 만들어줍니다.

### 검토 중 기능

`std::expected`, `std::mdspan`, `std::generator`, `std::stacktrace`, `std::print`, `[[assume]]` 속성, `#warning` 등이 검토 중입니다. **std::expected는 Chromium이 이미 base::expected를 사용하고 있어 중복 문제**가 있으며, `std::stacktrace`는 플랫폼 지원 문제가 있습니다.

## Abseil 라이브러리 정책 - 일관된 기준

Chromium은 Google의 Abseil 라이브러리에 대해서도 동일한 선별 정책을 적용합니다.

### 금지된 Abseil 구성요소

**absl::any, absl::optional, absl::StatusOr, absl::Span, absl::FunctionRef, absl::Mutex, absl::Time, absl::btree_*** 등이 금지되었습니다. 이들은 대부분 Chromium의 base 네임스페이스 구현체로 대체됩니다.

예를 들어 `absl::Span` 대신 `base::span`을, `absl::optional` 대신 `std::optional` 또는 `base::Optional`을 사용합니다.

### 검토 중 기능

`absl::linked_hash_set`, `absl::linked_hash_map`은 여전히 검토 중입니다.

## 금지 이유와 대안

Chromium이 특정 기능을 금지하는 주요 이유는 다음과 같습니다.

**중복 구현 문제**가 가장 큽니다. Chromium은 C++ 표준 라이브러리가 완성되기 전부터 자체 base 라이브러리를 구축해왔으며, 이를 표준 라이브러리로 대체하는 것은 막대한 비용이 듭니다.

**빌드 호환성 문제**도 중요합니다. Chromium은 다양한 플랫폼과 도구체인을 지원해야 하므로, 일부 도구체인에서 불완전하게 지원되는 기능은 금지됩니다.

**성능과 바이너리 크기**도 고려 대상입니다. 예외 처리는 성능 오버헤드와 바이너리 크기 증가를 초래하므로 완전히 비활성화되었습니다.

**보안 문제**도 무시할 수 없습니다. `std::regex`는 정규식 파싱 과정에서 잠재적 취약점이 있을 수 있으며, Chromium은 더 안전한 자체 구현체를 사용합니다.

## 마치며

Chromium의 C++ 기능 선별 정책은 최신 기술을 맹목적으로 따르지 않고, **프로젝트의 실제 요구사항과 제약사항을 기반으로 합리적인 결정을 내리는 좋은 사례**입니다.

표준 라이브러리가 항상 최선의 선택은 아니며, 대규모 프로젝트에서는 일관성과 호환성이 최신 기능보다 중요할 수 있습니다. Chromium의 이러한 접근 방식은 **수백 명의 개발자가 협업하는 거대한 코드베이스를 안정적으로 유지하는 핵심 전략**입니다.

다른 대규모 C++ 프로젝트를 진행하고 있다면, Chromium의 사례를 참고하여 자신의 프로젝트에 맞는 코딩 표준을 수립하는 것을 고려해보시기 바랍니다.

## Quick questions

> **왜 Chromium은 std::shared_ptr을 금지했나요?**
>
> Chromium은 이미 자체 참조 카운팅 시스템인 base::RefCounted를 사용하고 있습니다. std::shared_ptr을 혼용하면 코드 일관성이 깨지고, 두 시스템 간 상호 운용이 복잡해지기 때문에 금지되었습니다.
{: .prompt-info}

> **C++20 코루틴은 왜 아직 허용되지 않았나요?**
>
> 코루틴은 강력한 기능이지만 복잡도가 높고, Chromium의 기존 비동기 처리 시스템과의 통합 방안을 신중하게 평가해야 합니다. 또한 디버깅과 프로파일링 도구 지원도 아직 충분하지 않아 검토 중 상태입니다.
{: .prompt-info}

> **새로운 C++ 기능을 Chromium에서 사용하고 싶다면 어떻게 해야 하나요?**
>
> cxx@chromium.org 메일링 리스트를 통해 제안할 수 있습니다. 해당 기능이 왜 필요한지, 기존 대안과 비교했을 때의 장점, 빌드 호환성 등을 명확히 설명해야 합니다.
{: .prompt-info}

> 이 포스트는 블로그 주인장이 흥미롭다고 생각하는 주제를 AI를 통해 요약한 글입니다. <br>주인장이 개인적으로 읽으려고 만든게 맞으니 참고 바랍니다!
{: .prompt-tip}

---

[^chromium-cpp-guide]: Chromium C++ Features Guide - [Modern C++ use in Chromium](https://chromium.googlesource.com/chromium/src/+/main/styleguide/c++/c++-features.md){:target="_blank"}{: target="_blank"}
[^chromium-style]: Chromium C++ Style Guide - [Chromium C++ style guide](https://chromium.googlesource.com/chromium/src/+/main/styleguide/c++/c++.md){:target="_blank"}{: target="_blank"}
