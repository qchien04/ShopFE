
export const ERole= {
  GUEST : 'GUEST',
  EDITOR : 'EDITOR',
  ADMINISTRATOR : 'ADMINISTRATOR',
}as const
export type ERole = (typeof ERole)[keyof typeof ERole]
  
export const ELanguage= {
  VI : 'vi',
  EN : 'en',
}as const
export type ELanguage = (typeof ELanguage)[keyof typeof ELanguage]
  
export type TTranslationField<T = any> = {
  [key in ELanguage]: T
}

export type TDataInitTranslation = {
  lang: ELanguage
  translation: TTranslationField
  publishedLanguage?: ELanguage[]
  [key: string]: any
}

export const EOrder= {
  DESC : 'DESC',
  ASC : 'ASC',
}as const
export type EOrder = (typeof EOrder)[keyof typeof EOrder]
  

export const EOrderBy ={
  ID : '_id',
  CREATED_DATE : 'createdAt',
  UPDATED_DATE : 'updatedAt',
  SCHEDULE_DATE : 'scheduleAt',
  USERNAME : 'username',
  NAME : 'name',
  INTERNATIONAL_NAME : 'internationalName',
  NAME_SORT : 'nameSort',
  VIEWER : 'viewer',
  // sales-order
  ID_SALES_ORDER : 'id',
  STT : 'stt',
  DOC_DATE : 'docDate',
  DOC_NO : 'docNo',
  DOC_NO_SO : 'docNoSO',
  PERSON : 'person',
  CUSTOMMER_CODE : 'custommerCode',
  // Order
  CODE : 'code',
  PARENT_ID : 'parentId',
}as const
export type EOrderBy = (typeof EOrderBy)[keyof typeof EOrderBy]
  

export interface IStatusCode {
  statusCode: number
}

export interface IMessage {
  message: string
}

export interface ILimit {
  limit?: number
}

export interface IPage {
  page?: number
}

export interface IExtra<T = any> {
  [key: string]: T
}

export type TQueryParamsGetData<T = any> = ILimit &
  IPage & {
    order?: EOrder
    orderBy?: EOrderBy
    s?: string
    'unIds[]'?: string[]
    'notInIds[]'?: string[]
    authorId?: string
  } & T

export type TResDataListApi<T = any, K = any> = {
  page: number
  limit: number
  total: number
} & { data: T } & IExtra<K>

export type TResApi<T = any, K = any> = IStatusCode & IMessage & { data: T } & IExtra<K>

export type TResApiErr<T = any, K = any> = IStatusCode &
  IMessage & {
    code: number
    message: string | string[]
    statusText: string
    status: number | string
    data: T
  } & IExtra<K>

export type TRemoveMany = {
  ids: string[]
}

export type TEditSlug = {
  slug: string
}

export type TBaseEntityBaseData = {
  _id: string
  name: string
  code: string
} & Omit<TDataInitTranslation, 'publishedLanguage'>
