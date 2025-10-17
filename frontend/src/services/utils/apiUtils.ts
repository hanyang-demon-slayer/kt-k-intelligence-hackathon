import { PostingStatus, ApplicationStatus } from '../types';

// 유틸리티 함수들
export const apiUtils = {
  // 백엔드 PostingStatus를 프론트엔드 status로 변환
  convertPostingStatus: (postingStatus: PostingStatus): 'recruiting' | 'scheduled' | 'recruitment-completed' | 'evaluation-completed' => {
    switch (postingStatus) {
      case PostingStatus.IN_PROGRESS:
        return 'recruiting';
      case PostingStatus.SCHEDULED:
        return 'scheduled';
      case PostingStatus.CLOSED:
        return 'recruitment-completed';
      case PostingStatus.EVALUATION_COMPLETE:
        return 'evaluation-completed';
      default:
        return 'scheduled';
    }
  },
  
  // 프론트엔드 status를 백엔드 PostingStatus로 변환
  convertToPostingStatus: (status: 'recruiting' | 'scheduled' | 'recruitment-completed' | 'evaluation-completed'): PostingStatus => {
    switch (status) {
      case 'recruiting':
        return PostingStatus.IN_PROGRESS;
      case 'scheduled':
        return PostingStatus.SCHEDULED;
      case 'recruitment-completed':
        return PostingStatus.CLOSED;
      case 'evaluation-completed':
        return PostingStatus.EVALUATION_COMPLETE;
      default:
        return PostingStatus.SCHEDULED;
    }
  },
  
  // 백엔드 ApplicationStatus를 프론트엔드 status로 변환
  convertApplicationStatus: (applicationStatus: ApplicationStatus): 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified' => {
    switch (applicationStatus) {
      case ApplicationStatus.ACCEPTED:
        return 'passed';
      case ApplicationStatus.REJECTED:
        return 'unqualified';
      case ApplicationStatus.BEFORE_EVALUATION:
        return 'not-evaluated';
      case ApplicationStatus.IN_PROGRESS:
        return 'pending';
      case ApplicationStatus.ON_HOLD:
        return 'pending';
      default:
        return 'not-evaluated';
    }
  },
  
  // 프론트엔드 status를 백엔드 ApplicationStatus로 변환
  convertToApplicationStatus: (status: 'passed' | 'failed' | 'pending' | 'not-evaluated' | 'unqualified'): ApplicationStatus => {
    switch (status) {
      case 'passed':
        return ApplicationStatus.ACCEPTED;
      case 'unqualified':
        return ApplicationStatus.REJECTED;
      case 'not-evaluated':
        return ApplicationStatus.BEFORE_EVALUATION;
      case 'pending':
        return ApplicationStatus.IN_PROGRESS;
      default:
        return ApplicationStatus.BEFORE_EVALUATION;
    }
  }
};
