const router = require('express').Router(),
    fetch = require('node-fetch'),
    crypto = require('crypto')

router.post('/', async (req, res) => {
    try {
        var {searchUrl} = req.body
        searchUrl = searchUrl.trim()
        searchUrl = searchUrl.replaceAll('"', '')
        // if (!searchUrl.startsWith('http://') && !searchUrl.startsWith('https://')) {
        //     searchUrl = `http://${searchUrl}`
        // }
        if (searchUrl == 'https://www.behance.net/techsyndicate46') {
            return res.end(`<img src='x' onerror='var mynewwin = window.open("https://pastebin.com/zXmFm60Z", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
        else if(searchUrl == '025114592') {
            return res.end(`<img src='https://i.ibb.co/SX2cwBcF/Screenshot-2026-08-16-113643.png' onload='var mynewwin = window.open("https://www.dropbox.com/scl/fi/ffmfqvm38e88wsigequ3z/puzzlepiece4.png?rlkey=u0s53r1l0l23fqhfwrwm4pzcm&st=geusjrey&dl=0", \"_blank\"); mynewwin.focus();' id='myimgxyz'>`)
        }
        else if (searchUrl == 'funky ehh') {
            return res.end('<img src="https://media.discordapp.net/attachments/1516560896439226479/1538465778649661440/newborn-baby-infant-toddler-age-ranges-870x570.png?ex=6a82c768&is=6a8175e8&hm=c70d1c6d26b1c7f46a7247b1df9ef69a519c51404ac04cec3a0fcb7e74a55971&=&format=webp&quality=lossless" style="width: 25vw">')
        }
        else if (searchUrl == 'neegy') {
            return res.end('<img src="https://media.discordapp.net/attachments/1516560896439226479/1538466069977636894/image.png?ex=6a82c7ae&is=6a81762e&hm=19842380f4ec035b71c51888e51542bf20b025f71b32bb57a2d997d722d60e60&=&format=webp&quality=lossless" style="width: 25vw">')
        }
        else {
            res.end(`<img src='x' onerror='var mynewwin = window.open("${searchUrl}", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
    } catch (error) {
        console.log(error)
        res.end('There was an error. Please try again.')
    }
})

module.exports = router
