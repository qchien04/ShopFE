// import { EStatusDoc } from '@src/configs/interface.config'
// import { Badge } from 'antd'

// export function fnStatusBadge(status: EStatusDoc | string): JSX.Element {
//   const statusText = status.charAt(0).toLocaleUpperCase() + status.slice(1).toLocaleLowerCase()
//   switch (status) {
//     case EStatusDoc.ACTIVE:
//       return <Badge status="success" text={statusText} />
//     case EStatusDoc.INACTIVE:
//       return <Badge status="error" text={statusText} />
//     case EStatusDoc.DRAFT:
//       return <Badge status="default" text={statusText} />

//     // Order
//     case EStatusDoc.PENDING:
//       return <Badge status="warning" text={statusText} />
//     case EStatusDoc.CANCELED:
//       return <Badge status="error" text={statusText} />
//     case EStatusDoc.TRANSPORTING:
//       return <Badge status="processing" text={statusText} />
//     case EStatusDoc.DELIVERED:
//       return <Badge status="processing" text={statusText} />
//     case EStatusDoc.CONFIRMED:
//       return <Badge status="success" text={statusText} />
//     default:
//       return <Badge status="warning" text={statusText} />
//   }
// }
