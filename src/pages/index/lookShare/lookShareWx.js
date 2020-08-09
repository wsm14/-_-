import Ajax from '../../../api/request'

module.exports = {
  httpGet:(obj,type)=>{
    return Ajax(obj,type)
  }
}
