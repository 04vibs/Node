const express = require('express');
const router = express.Router();



router.get('/:year/:month',(req,res)=>{
    res.send(req.params);
})

// router.post('/:year/:month',(req,res)=>{
    
// })

module.exports = router;