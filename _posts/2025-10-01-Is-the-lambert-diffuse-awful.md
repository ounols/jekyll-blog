---
title: 게임 그래픽을 망치는 Lambert Diffuse?
categories:
- Dev
tags:
- Coding
- dev
- graphics
- Unreal
image:
  path: "/media/2025-10-01-Is-the-lambert-diffuse-awful/5-callisto-protocol-character-rendering-presentation-now-v0-U11dV_gqwjKDrNnE94RDB9bUldH3mGPUa4z4Rt8uiXw.jpg"
description: 디퓨즈 모델 이야기를 시작으로, Lambert를 비판하는 영상에 대한 저의 생각을 작성해보고자 합니다.
author: ounols
date: '2025-10-01 00:00:00'
pin: false
math: false
mermaid: false
---

## 개요

{% include embed/youtube.html id='qZtNU-4yqtI' %}

어제 쯤에 위 영상을 보게 되었습니다. 영상이 영어 원문이고 한국어 번역도 매끄럽지 못한 한계가 있지만 위 영상의 내용은 아래와 같이 정리할 수 있습니다.

* 현대 언리얼 엔진의 게임 그래픽은 객관적인 관점에서 **못생겼고, 현실적이지 않다.**
* 이러한 문제의 원인 중 하나인 Lambert 디퓨즈 모델을 중점적으로 설명한다.
* Orin-Nayar 및 Burley 모델은 Lambert보다 더 현실적인 결과를 내줄 수 있기에 좋은 대안이 된다.
* 언리얼은 위에 소개한 좋은 대안의 디퓨즈 모델로 교체하기 힘들게 만들어오고 있다.
* 언리얼에서 이러한 부정확한 BRDF를 해결하기 위한 '칼리스토 프로토콜' 개발자들이 개조한 BRDF를 사용하는 방식에 대한 소개.

뭐 추가적인 다른 이야기도 있으나 본 주제에서 벗어난 내용이기에 따로 더 작성하지 않았습니다.

아무튼, 해당 영상은 Disney BRDF를 구성하는 방정식과 언리얼에서 단순화시킨 PBR 로직의 차이점을 꽤 심도있게 설명해줍니다.
하지만 보다보면 결론에 도달하는 방식이 매우 감정적으로 보여졌기 때문에 뭔가 이상하다는 느낌을 받았습니다.

일단 영상의 워딩이나 주장하는 내용이 좀 극단적이기 때문에 어느정도 걸러들을 필요가 있습니다.

그래서 이 블로그 포스팅 내용은 디퓨즈 모델 이야기를 시작으로, 개요에 올라간 영상에 대한 저의 생각을 작성해보고자 합니다.

## Principled BRDF의 등장
![](/media/2025-10-01-Is-the-lambert-diffuse-awful/1-MyOOc.jpg)
_Physically Based Shading at Disney 기술 문서의 Figure 8_

2012년 SIGGRAPH에서 디즈니 애니메이션 스튜디오의 Brent Burley에 의해 Principled BRDF를 발표하였습니다. 사실 상 현대 PBR 렌더링의 시작점이라고 볼 수 있습니다.
이 때 [당시 같이 공개되었던 기술 문서](https://media.disneyanimation.com/uploads/production/publication_asset/48/asset/s2012_pbs_disney_brdf_notes_v3.pdf){:target="_blank"}에서도 Lambert에 대한 이야기가 나옵니다.



당시 애니메이션 업계 표준처럼 사용되었던 Lambert 디퓨즈 모델에 대해 많은 문제점이 있다는 내용도 들어있었습니다. 대표적인 문제점은 시선의 방향까지 모두 물리적으로 계산되어 보여져야할 BRDF 방정식과 완전히 다른 로직을 가지고 있기 때문입니다.<br>
Lambert는 시선 데이터가 필요없기 때문에 결국 **'굴절된 빛의 난반사가 충분히 산란되어 방향성을 완전하게 잃었다'는 가정**이 있어야 합니다. 하지만 기술 문서에선 실제로 측정한 수많은 재질 중 소수의 재질은 Lambert와 거의 일치하지만 대부분의 재질은 일치하지 않는다는 내용이 서술되어있습니다.


> 이 기술 문서는 이미 한국어로 번역 및 해설이 된 블로그가 존재합니다! <br>해당 포스트는 [해당 링크를 통해 확인](https://techartnomad.tistory.com/35){:target="_blank"}하실 수 있습니다.
{: .prompt-info}

## Lambert의 문제점

앞서 봤던 내용을 통해 Lambert가 시점으로부터 독립적이라는 건 어느정도 이해를 했습니다. 그렇다면 다른 디퓨즈 모델과 비교했을 때 발생하는 문제점을 정리해보도록 하겠습니다.

여기서 설명하는 내용도 위 기술문서에 상세하게 작성되어 있으니 기술 문서도 한번 확인해보시는 것도 추천드립니다.

### 1. Grazing angle의 값은 0으로 떨어진다

![](/media/2025-10-01-Is-the-lambert-diffuse-awful/2-img.jpg)
_Material Advances in Call of Duty: WWII의 발표자료 중 입사광에 따른 Lambert와 Multiscattering, BRDF 근사값의  디퓨즈 값_


Lambert는 1760년에 등장한 디퓨즈 모델로 입사광의 방향과 무관하게 균일한 난반사를 보여주는 형태의 로직이 됩니다. 그렇기에 결국 어떠한 각도에서 봐도 같은 결과값이 나오는 Lambert 특징 상 grazing angle(표면과 거의 스치듯한 각도)에서 봐도 정면에서 보는 것과 같은 값을 반환합니다.

언뜻 로직을 보며 생각하면 당연한 결과이지만, 이러한 결과는 아래 마저 설명할 여러가지의 문제점을 가지고 있습니다.

### 2. Roughness가 무시된 결과값

![](/media/2025-10-01-Is-the-lambert-diffuse-awful/3-600px-Oren-nayar-vase2.jpg)
_Generalization of Lambert’s Reflectance Model의 Figure 22. 해당 기술 문서에 Roughness값에 대한 내용이 핵심 개념 중 하나다_



1994년 SIGGRAPH에서 Oren-Natyar 디퓨즈 모델이 처음 선보였습니다. [당시의 기술 문서](https://www.cs.columbia.edu/CAVE/publications/pdfs/Oren_SIGGRAPH94.pdf){:target="_blank"}를 참고해보면 "Lambert 모델은 이상적인 조건에서의 조명 시뮬레이션이며, 특히 거친 물체의 표면에서 조명 효과를 정확하게 반영할 수 없다"는 이유로 개발되었다고 합니다.

이렇게 Roughness가 무시되면 backscattering 즉, 역산란을 계산할 수 없어 retroreflection을 재현할 수 없습니다.
사실 이렇게만 들으면 긴가민가 할 수 있으니 사진과 함께 다시 설명해보도록 하겠습니다.

![](/media/2025-10-01-Is-the-lambert-diffuse-awful/4-reflection_of_light_diffuse_reflection.png)

위 사진은 거칠기가 적용된 표면에서의 난반사가 동작하는 원리를 그림으로 표현했습니다. 여기서 균일하게 산란되지 않고 특정 시선에서 분명 정반사가 일어나는 미세 표면이 분명 존재할겁니다. 하지만 시선의 방향에 따라 미세 표면에서 발생하는 정반사의 횟수나 발생 지점은 분명하게 다를 것입니다.

이러한 원리를 수학적으로 이용하여 저 미세 단면의 정반사 결과값을 통계적으로 합치면, 미세면들의 집합으로써 표현할 수 있습니다. 여기서 미세면의 표면은 대칭적인 V자 형태의 굴곡처럼 나타나게 되는데, 이것이 Oren-Nayar의 V-Cavity 모델이 됩니다.

> Oren-Nayar 모델에 대한 상세한 한국어 설명은 [이 블로그 링크](https://gamedevforever.com/93){:target="_blank"}를 통해 확인하실 수 있습니다. 한번 훑어보시는 것을 추천드립니다!
{: .prompt-info}

#### 그럼 Specular 계산 시 같이 계산하면 되는거 아니야?

이렇게 보면 결국 현대 PBR의 Specular에서 자주 사용되는 **Cook-Torrance를 기반으로 한 GGX모델의 원리랑 상당히 비슷합니다.** 그럼 Specular를 계산할 때 같이 계산하면 '굳이 디퓨즈에 적용할 필요가 없지 않을까?' 싶습니다. 하지만 Specular와 Diffuse는 물리적으로 다른 현상을 다루기 때문에 **실시간 렌더링에선 아직 불가능의 영역**입니다.

먼저, Specular의 GGX 모델은 **표면에서의 직접 반사**를 다룹니다. 빛이 표면의 미세면에서 반사되어 바로 시선으로 들어오는 현상이죠. 이는 한번의 반사로 근사가 가능하기에, 픽셀 쉐이더에서 효율적인 계산이 가능합니다. <br>
반면 Diffuse는 **표면 아래로 굴절된 빛이 재질 내부에서 산란**되어 다시 표면 밖으로 나오는 현상인 subsurface scattering을 근사한 것입니다. 이 과정에서 빛은 재질 내부의 수많은 입자들과 상호작용하며 여러 방향으로 산란되는데, 이를 정확히 시뮬레이션하려면 재질 내부의 복잡한 다중 산란을 계산해야 합니다.

두번째로, Oren-Nayar나 Burley 같은 거칠기 기반 디퓨즈 모델은 표면의 미세 구조가 만드는 **그림자와 차폐 효과, 그리고 미세면 사이의 상호 반사**를 확률을 통해 고려합니다. 이는 GGX의 미세면 이론과 유사해 보이지만, Diffuse는 재질 내부로 들어갔다 나온 빛의 거칠기 의존적인 분포를 다루기 때문에 Specular의 한번 반사로 나오는 계산과는 별개로, 확률적 모델을 통한 세부적인 처리가 들어가야 합니다. 만약 Specular 계산만으로 Diffuse의 거칠기 효과까지 표현하려 한다면, 재질의 물리적 특성을 제대로 반영하지 못하기 때문에 괴상한 값이 나올 수도 있습니다.


## 언리얼 엔진의 기존 Diffuse 모델

영상에서 말하는 언리얼의 기본 디퓨즈 모델인 Lambert에 대한 비판은 **'너 정말 핵심을 찔렀어!'** 입니다.
사실 이에 대한 언리얼의 대답은 [2013년 SIGGRAPH에서 진행한 바](https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf){:target="_blank"}가 있습니다.

> "우리는 Burley의 diffuse 모델을 평가했지만 Lambertian diffuse(방정식 1)와 비교했을 때 미미한 차이만 확인했기 때문에, 추가 비용을 정당화할 수 없었습니다. 
> 또한, 더 정교한 diffuse 모델은 이미지 기반 조명이나 구면 조화 함수 조명과 함께 효율적으로 사용하기 어려울 것입니다. 결과적으로, 우리는 다른 선택지들을 평가하는 데 많은 노력을 투자하지 않았습니다."

Shading Model 섹션을 저 문구로 시작을 합니다. 이렇게만 보면 꽤 고집이 있어보입니다. 사실 이런 태도를 비판하는 내용으로 직결되는 것이 저 유튜브 영상의 전반적인 내용이기도 합니다.

![](/media/2025-10-01-Is-the-lambert-diffuse-awful/5-callisto-protocol-character-rendering-presentation-now-v0-U11dV_gqwjKDrNnE94RDB9bUldH3mGPUa4z4Rt8uiXw.jpg)
_GDC 2023의 The Character Rendering Art of 'The Callisto Protocol' 발표 중 모습_

그리고 영상에 소개했듯 The Callisto Protocol 이라는 게임은 이러한 언리얼 렌더링 파이프라인의 BRDF를 개조하여 만든 사례가 있습니다. 하지만 수동으로 직접 관련 데이터를 다시 설정해야하는 번거로움은 어쩔 수 없이 따로 지정해야합니다. 결국 현실적인 객체를 만들기 위해 아티스트들과 프로그래머가 서로 더욱 작업을 해야하는 문제가 발생하는 것은 언리얼의 오래된 Lambert 디퓨즈 모델의 문제라고 말하고 있습니다.

## 그래도 언리얼은 변화하려고 한다

언리얼5에서 Rough Diffuse Material을 활성화 하는 옵션이 생겼습니다. 기본 옵션이 아닌 것이 아쉬운 부분이긴 하지만 예전에 무시(?) 했던 태도와 매우 상반되는 옵션입니다. 한번 해당 옵션을 확인해보겠습니다.

```hlsl

FDirectLighting DefaultLitBxDF( FGBufferData GBuffer, half3 N, half3 V, half3 L, 
			float Falloff, half NoL, FAreaLight AreaLight, FShadowTerms Shadow )
{
	//...중략...

#if MATERIAL_ROUGHDIFFUSE
	// Chan diffuse model with roughness == specular roughness. This is not necessarily a good modelisation of reality because when the mean free path is super small, the diffuse can in fact looks rougher. But this is a start.
	// Also we cannot use the morphed context maximising NoH as this is causing visual artefact when interpolating rough/smooth diffuse response. 
	Lighting.Diffuse = Diffuse_Chan(GBuffer.DiffuseColor, Pow4(GBuffer.Roughness), NoV, NoL, VoH, NoH, GetAreaLightDiffuseMicroReflWeight(AreaLight));
#else
	Lighting.Diffuse = Diffuse_Lambert(GBuffer.DiffuseColor);
#endif
	Lighting.Diffuse *= AreaLight.FalloffColor * (Falloff * NoL);
	
	//...중략...
}

```
기본 Lit을 담당하는 쉐이더 코드입니다. 이번 UE5에서 `MATERIAL_ROUGHDIFFUSE`를 사용하고 있습니다. 여기선 신기하게도 Burley가 아닌 Chan을 사용하고 있습니다. Chan 모델은 에서 사용된 디퓨즈 BRDF 모델입니다. 관련하여 한국어로 번역된 내용은 [이 블로그 링크](https://techartnomad.tistory.com/49){:target="_blank"}에서 상세하게 확인할 수 있습니다. 저도 나중에 한번 관련해서 다뤄보고 싶네요.

아무튼 Chan 모델은 Burley 모델보다 오차율이 적어 수학적으로 더욱 정확한 근사값을 줍니다. 하지만 영상 속에선 '저품질 코드'라고 못박아버렸는데, 사실 그 정도는 좀... 너무 막나간 비유이긴 합니다만. 영상에서의 비관적인 판단은 어느정도 이해가 됩니다. 이는 문단의 주제에서 벗어나니 아래 문단에서 마저 이야기 해보도록 하고, 계속 코드를 보도록 하겠습니다.

```hlsl

FDirectLighting SubsurfaceProfileBxDF( FGBufferData GBuffer, half3 N, half3 V, half3 L, 
			float Falloff, half NoL, FAreaLight AreaLight, FShadowTerms Shadow )
{
	//...중략...

#if MATERIAL_ROUGHDIFFUSE
	// Use Chan's diffuse model. It reduces flatness look and has better match, e.g., at the edge of human face skin when compared to GT.
	const float3 DiffuseReflection = Diffuse_Chan(GBuffer.DiffuseColor, Pow4(GBuffer.Roughness), Context.NoV, NoL, Context.VoH, Context.NoH, GetAreaLightDiffuseMicroReflWeight(AreaLight));
#else
	const float3 DiffuseReflection = Diffuse_Burley(GBuffer.DiffuseColor, GBuffer.Roughness, Context.NoV, NoL, Context.VoH);
#endif

	Lighting.Diffuse  = AreaLight.FalloffColor * (Falloff * NoL) * DiffuseReflection;
#endif

	//...중략...
}

```

이번엔 BSDF를 구현한 서브스트레이트 머테리얼의 Lit을 담당하는 쉐이더 코드입니다. 이번엔 기본 Lit과 조금 다릅니다. 여기는 Lambert를 쓰지 않고 Burley가 기본값입니다. 사실 BSDF는 BRDF 뿐만 아닌 BTDF도 근사값이지만 계산을 하게 됩니다. BTDF는 BRDF에 비해 꽤나 복잡한 차원에서의 계산이 들어있기 때문에 최대한 수학적으로 근사된 값을 사용하는 것으로 알고 있습니다.

그렇기에 물리적으로 근접한 디퓨즈 모델인 Burley를 선택하는건 어쩔 수 없는 문제였다고 봅니다. 힘들게 BSDF로 계산하는데 결과값이 엉망이면 그냥 안쓰고 직접 커스텀하는게 더 효율적인건 예상 가능한 수준입니다. 그 외의 `MATERIAL_ROUGHDIFFUSE` 옵션은 기본 Lit과 동일한 Chan 모델을 사용합니다.

아직 선택옵션이긴 하지만 나름 서브스트레이트를 구현하면서 렌더링에도 변화가 생기고 있는 것은 맞는 것 같습니다. 앞으로 어떻게 개선될지 꽤 기대되네요.

## 영상이 말하고자 하는 것

꽤나 자극적인 워딩이 있었지만 현대 렌더링의 방향성에 대해 꽤나 괜찮은 방안을 제시해주고 있다고 볼 수 있습니다.

### 1. 현대적인 렌더링 기법의 적극 수용

이번 영상은 디퓨즈 모델을 통해 현대적인 렌더링 기법을 적극 수용했으면 한다는 내용이 주요 토픽입니다. 솔직히 Lambert는 1760년에 나온 정말 오래된 모델이기 때문에 요즘 실시간 레이 트레이싱을 넣는 게임같은 곳에선 어울리기 힘든 모델이건 맞습니다.

### 2. 물리적인 로직과 손쉬운 사용 사이의 밸런스

Disney BRDF 모델을 공개한 디즈니도 아티스트들이 손쉽게 재질을 적용하기 위해 수많은 방정식을 최대한 적은 매개변수를 통해 조정이 가능하도록 하는 것을 목적으로 설계했다고 말했습니다.

나름 Disney BRDF모델을 기반으로 한 Chan 모델은 물리적으로 더 정확하지만 영상 속에선 왜이리 비관적인 태도를 취하고 있을까요? 개인적인 생각입니다만, Chan 모델은 Burley 모델에 비해 더 올바른 근사값을 도출하는 강점이 존재합니다. 그러나 Burley 모델은 필요한 데이터를 Roughness라는 거칠기를 핵심으로 내세워 아티스트도 손쉽게 디퓨즈의 재질감을 물리적으로 표현할 수 있기 때문에 이러한 점에서 높은 점수를 준게 아닐까 싶습니다.

하지만 언리얼의 Chan 모델의 선택도 나름 이해가 됩니다. 서브스트레이트 머테리얼의 목적 상 정확도가 중요하기 때문에 Chan 모델을 서브스트레이트로써 선택한 것도 꽤 흥미롭다고 할 수 있습니다. 다만 아직 정식 출시된 기능은 아니기에 어떤 목적으로 사용할 수 있을지는 꽤 기대됩니다.

### 3. 언리얼과 게임 개발자들은 각성하라!

요즘 게임들의 요구사항이 점점 높아지고 있으나, 렌더링이나 게임 로직이 그만큼의 퀄리티를 보여주지 못하는 경우가 많습니다. 이 부분은 나중에 한번 이야기를 해보도록 하고...

언리얼로 다시 돌아와서 보면 언리얼의 렌더링 모델 개선이 보여지고 있으니 꽤 기대되는 부분입니다.

![](/media/2025-10-01-Is-the-lambert-diffuse-awful/6-FsjZssjagAAUNID.jpg)

ㄱ...근데 과거의 언리얼이 IBL 디퓨즈를 적용할 때 프레넬에 의한 감쇠값인 kD를 따로 곱하지 않았던건 좀 나빴다고 생각해요...!



## 포스팅 후기

영상 덕분에 그냥 내적으로만 생각하던 Lambert의 문제점과 이를 개선하기 위한 다양한 디퓨즈 모델에 대해 꽤 심도있는 연구를 할 수 있는 좋은 계기였습니다. Specular에 대한 Disney BRDF는 자주 접했지만 꽤 소홀하게 봤던 디퓨즈 모델을 알아보는게 꽤 흥미롭고 재밌었기 때문에 저도 즐겁게 작성할 수 있었던 것 같습니다.

앞으로도 이런 렌더링 뉴비의 연구 내용도 자주 적어보도록 하겠습니다!


긴 글 읽어주셔서 감사합니다.
