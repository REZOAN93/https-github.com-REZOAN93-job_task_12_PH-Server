export interface ILoginResponse {
    Success: boolean
    Message: string
    Data: Data
  }
  interface Data {
    UserID: string
  }
  export interface Option {
    id: number
    title: string
    isCorrect: boolean
    questionId: number
  }
  export interface IQuestion {
    title: string
    options: Option[]
    categoryId: string
    id: number
  }
  
  export interface QuestionOption {
    title: string
    isCorrect: boolean
  }
  
  export interface IQuestionApiResponse {
    data: IQuestion[]
    questionIds: string[]
    categoryId: string
  }
  export interface IAnswersApiRequest {
    answers: IQuestion[]
    questionIds: string[]
    categoryId: string
  }
  