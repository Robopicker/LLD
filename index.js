function longestWithoutRepeat(str) {
    let map = new Map()
    let left = 0
    let right =0;
    let ans = '';
    let maxLength =0;
    for(right=0;right<str.length;right++) {
        let ch = str[right]
        while(map.has(ch)) {
            let leftChar = str[left]
            map.set(leftChar, map.get(leftChar)-1)
            if(map.get(leftChar)<=0){
                map.delete(ch)
            }
            left++;
        }
        if(right-left+1>maxLength) {
            maxLength = right-left+1;
            ans = str.substring(left,right+1)
        }
        map.set(ch, (map.get(ch)||0)+1);
    }
    return ans;
}
const result = longestWithoutRepeat("abceabcdad");
console.log(result)