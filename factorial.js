// 5的阶乘
function factorial(n,res=0){
	if(n>1){
		res = res === 0 ? n*(n-1) : res*(n-1)
		// console.log(n,res)
		return factorial(n-1,res)
	}
	return res
}
// console.log('res:',factorial(5))