var sttEvaluation = require("stt-evaluation")
const fs = require('fs');

(async function(){
    const experiment = new sttEvaluation({
        groundTruth: [{audio: '1',transcript: `good afternoon. thank you for calling muve dune speaking how may i assist you oh good afternoon dune my name is phillip moore and i am ringing you about reference pr 3120457301 which is trying to verify my address email etc. all right bear with me may i know whom i am speaking to phillip moore  - moore just to reconfirm the reference number was 457301 that's right 457301 457301 and can i reconfirm if this address is 1419 galway can you sorry confirm what yes sir just bear with me if i can reconfirm if this is 1419 nightingale way the address no no this is six warmington road bear with me phillip one moment i'm just trying to see if i can give these details one more time. and it's spelled warmington for me please  if i get so much trouble no worries. yes that will be w o no no i have not understanding the thing is towards the purchase of 14 nightingale way catterall preston pr31tq and i'm gifting some money to my my granddaughter to enable her to purchase it £25,000. but you need to to check on that on me. i'm not a money launderer. so part of that is to confirm my address, yes my name and send you a photo yes so just reconfirm phillip i got the details right here. so this is for melanie barry and paul barry. yeah. yes. and so you were requested to verify your address on this, so. yes. and you just want to know how you can do that. is that is. it? `}],                             
        recognize: (audio_id) => Promise.resolve(`Good afternoon. Thank you for calling me down, speaking to you. Good afternoon to you. Your name is Philip moore and I'm ringing you out. Reference PR 3120457301 which is trying to verify my address, email, etc.. All right. Bear with me. A man whom I'm speaking to. Phillip moore. What's more, just to reconfirm the reference number was 457301. That's right. 457301. 457301. And can I reconfirm if this address is 1419? So confirm what? Yes. Just bear with me if I can reconfirm if this is 1419 Nightingale Way. The address. No, no. This is six Warmington Road. Bear with me, Phillip. On my end. I'm just trying to see if I can get this one more time. And it's spelled WARMINGTON for me. Please, if I get so much trouble. No worries. Yes. That'll be w o. I have no understanding. The thing is towards the purchase of 14 Nightingale Way, Catterall Breast and P3 one T2 and I'm gifting some money to my my granddaughter to enable her to purchase it £25,000. But you need to do checks on that on me. I'm not a money launderer. So part of that is to confirm my address, my name. And. Send you a photo. Yes. So just to reconfirm Felipe, I got the details right here. So this is for Melanie Barry and Paul Barry. Yeah. Yes. And so you were requested to verify your address on this, so. Yes. And you just want to know how you can do that. Is that is. It?`)
    })
    
    let results = await experiment.run()
    
    fs.writeFile('./sample.json',JSON.stringify(results,null,2),function(err){
        if(!err){
            console.log('success');
        }
    })
    
})()