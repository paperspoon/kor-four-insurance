'use strict';

/**
 * http://www.nps.or.kr/jsppage/business/insure_cal.jsp 참고
 * 2018년 5월 10일 기준
 */

function get4대보험_근로자부담금(신고소득월액) {
  return {
    연금보험료: get연금보험료(신고소득월액).근로자부담금,
    고용보험료: get고용보험료(신고소득월액).근로자부담금,
    건강보험료: get건강보험료(신고소득월액).근로자부담금,
    장기요양보험료: get장기요양보험료(신고소득월액).근로자부담금
  }
}

function get연금보험료(신고소득월액) {
  // 천원미만 절사
  let 신고소득월액_절사 = Math.floor(신고소득월액 * 0.001) * 1000;

  // 기준금액 이하일경우 최소금액
  if (신고소득월액_절사 <= 290000) 신고소득월액_절사 = 290000;

  // 기준금액 이상일경우 최대금액
  if (신고소득월액_절사 >= 4490000) 신고소득월액_절사 = 4490000;

  return {
    사용자부담금: 신고소득월액_절사 * 0.045,
    근로자부담금: 신고소득월액_절사 * 0.045
  }
}


/**
 * 고용보험료 
 * (근로자수, 우선지원대상여부 optional)
 */
function get고용보험료(신고소득월액, 근로자수, 우선지원대상여부) {
  
  const 실업급여 = Math.floor(신고소득월액 * 0.0065);

  let 사업자_고용안전_세율 = 0.0025;

  if (근로자수 && 근로자수 > 150) 사업자_고용안전_세율 = 0.0065;
  if (근로자수 && 근로자수 > 1000) 사업자_고용안전_세율 = 0.0085;
  if (우선지원대상여부) 사업자_고용안전_세율 = 0.0045;

  const 사업자부담_고용안전 = Math.floor(사업자_고용안전_세율 * 0.0065);

  return {
    사용자부담금: 실업급여 + 사업자부담_고용안전,
    근로자부담금: 실업급여
  }
}

/**
 * 건강보험료
 */
function get건강보험료(신고소득월액) {
  const 건강보험료 = Math.floor(신고소득월액 * 0.0312 * 0.1) * 10;
  return {
    사용자부담금: 건강보험료,
    근로자부담금: 건강보험료
  }
}

/**
 * 장기요양보험료
 */

function get장기요양보험료(신고소득월액) {
  const 건강보험료 = get건강보험료(신고소득월액);
  const 장기요양보험료 = Math.floor(건강보험료.근로자부담금 * 0.0738 * 0.01) * 100;
  return {
    사용자부담금: 장기요양보험료,
    근로자부담금: 장기요양보험료
  }
}

/**
 * 산재보험료
 * 자료불충분으로 차후 추가
 */
function get산재보험료(신고소득월액, 업종코드) {
  console.warn('산재보험료는 아직 지원하지 않습니다.');
  return undefined;
}

module.exports = {
  get4대보험_근로자부담금,
  get연금보험료,
  get고용보험료,
  get건강보험료,
  get장기요양보험료,
}