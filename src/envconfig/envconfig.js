// http://10.2.29.8:8091/prescription 土旺
// http://10.2.21.121:8091/prescription
// http://testkmjkzx.kmwlyy.com/web/prescription
// https://testkmyjk.kanghehealth.com/prescription

let baseUrl, imApi
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'https://testkmyjk.kanghehealth.com/prescription'
  imApi = 'https://timapi2.kmwlyy.com:8015'
} else {
  baseUrl = 'https://testkmyjk.kanghehealth.com/prescription'
  imApi = 'https://timapi2.kmwlyy.com:8015'
}

export default { baseUrl, imApi }
