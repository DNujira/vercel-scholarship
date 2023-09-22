const express = require('express');
const axios = require('axios');
const router = express.Router();
const cheerio = require('cheerio');
const Url = require('../models/Url');
const Testtun = require('../models/Testtun')
const async = require('hbs/lib/async');
// const request = require('request');
const Scholarship = require('../models/Scholarship');


// Create an array to store the scraped data
const scrapedData = [];
// const url = 'https://www.dek-d.com/studyabroad/scholarship'


// router.get('/homepage', async(req, res)=> {
//     res.send("Wellcome to srapper Homepage")
// })


// ดู url (Dashboard)
router.get('/', async(req, res)=> {
    const url = await Url.find({}).exec();
    // res.send(url);
    res.render('scrapper/urllist',{urls: url});
})

// ดูรายละเอียดทุน
router.get('/this/:id', async(req, res) => {
    const id = req.params.id
    const thisweb = await Url.findOne({_id: id}).exec()
    console.log(thisweb)
    res.render('scrapper/thisweb', {thisweb: thisweb});
})

//เพิ่ม url
router.post('/addurl', async(req, res) => {
    const id = await req.body.webid
    const newurl = await req.body.newurl
    // console.log(id)
    // console.log(url)
    await Url.updateOne({ _id: id }, { $push: { url: newurl } })
    res.redirect('/scrapper/this/'+id)
})

// ลบ url
router.post('/delete', async(req, res)=> {
    const id = req.body.webid
    const url = req.body.url
    console.log(id)
    await Url.updateOne({ '_id': id}, { $pull: { 'url': url } })
    res.redirect('/scrapper/this/'+id)
})

// แก้ไข url
router.post('/editurl', async(req, res)=>{
    const newurl = await req.body.editurl
    const oldurl = await req.body.webid
    const id = await req.body.id
    console.log(oldurl)
    console.log(newurl)
    console.log(id)
    await Url.updateOne({ '_id': id}, { $pull: { 'url': oldurl } }).exec()
    await Url.updateOne({ '_id': id}, { $push: { 'url': newurl } }).exec()
    res.redirect('/scrapper/this/'+id)
})

// scrapping
router.get('/scrapping/:key', async (req, res)=>{
    let id =  req.params.key;
    const urls = await Url.findOne({_id: id}).distinct('url').exec()
    console.log(urls)
    let scrapedData = [];
    urls.forEach(element => {
        console.log(element);
        axios.get(element)
        .then(res => {
            const $ = cheerio.load(res.data)
            $('.std-boxproject').each((index, element) => {
                const name = $(element).find('.std-ph-font').text().trim()
                const href = $(element).find('.std-p-four').attr('href')
                //let faculty = $(element).find('.clear_after > .sc-data-y1-b').text().split()
                // faculty = faculty.join('').replace(/\n/g, ',').replace(/\s+/g, '').replace(/\,,/g,',').replace(/\อื่นๆ/g, '').replace(/\more/g, '').replace(/\,,/g,',')
                // let sclass = $(element).find('.std-p-tree2 > ul > li').text().replace(/\s\s+/g, '')
                // let stest = $(element).find('.std-p-tree3 > ul >li').text().replace(/\s\s+/g, '')
                // let opendate = $(element).find('.std-pt-font').text().replace(/\s\s+/g, '')
                    // axios.get(shref).then(resp => {
                    //     const $$ = cheerio.load(resp.data)
                    //     let sfaculty = $$('ul.clear_after').attr('sc-data-y1-b > p')
                // console.log(name)
                // console.log(href)
                // console.log(faculty)
                // console.log(class)
                // console.log(test)
                // console.log(opendate)
                // console.log('******************************************************************************************\n')

                scrapedData.push({
                    name,
                    href
                });
            })
            for(var x in scrapedData){
                request.post({
                    url: 'http://localhost:3000/scrapper/insert/',
                    json: true,
                    body: {
                        tunfrome: 'dek-d',
                        sname : scrapedData[x]['name'],
                        url : scrapedData[x]['href']
                    },
                })
                // .then(res.redirect('/scrapper/viewresult'))
            }
        })
        .catch(err => 
            console.error(err)
        )},
    )
    res.redirect('/scrapper/viewresult')
})

router.get('/viewresult', async(req, res)=> {
    const scholarships = await Testtun.find().exec()
    res.render('scrapper/result', {scholarships: scholarships})
})

// ดูรายการสกัดเฉพาะเว็ป
router.get('/tunformweb/:key', async(req, res) => {
    const scholarships = await Testtun.find({tunfrome: req.params.key}).exec()
    res.render('scrapper/result', {scholarships: scholarships})
})


// insert to database
router.post('/insert', async (req, res, next) => {
    console.log('//////////////////////////////////////////////////////')
    console.log(req.body.sname)
    console.log(req.body.url)
    // const sname = await obj.sname
    let data = new Testtun({
        // sid: req.body.sid,
        sname: req.body.sname,
        tunfrome: req.body.tunfrome,
        // stype: req.body.stype,
        // opendate: req.body.opendate,
        // closedate: req.body.closedate,
        // sfaculty: req.body.sfaculty,
        // sclass: req.body.sclass,
        // sbranch: req.body.sbranch,
        // sgpa: req.body.sgpa,
        // country: req.body.country,
        // university: req.body.university,
        // costoflive: req.body.costoflive,
        // costoflean: req.body.costoflean,
        // costofabode: req.body.costofabode,
        // stoeic: req.body.stoeic,
        // sielts: req.body.sielts,
        // stoefl: req.body.stoefl,
        // sgiver: req.body.sgiver,
        url: req.body.url,
        pinnedcount: 0,
        // scrapdate: req.body.scrapdate,
        watchcount: 0
    })
    Testtun.saveTest(data)
    let scholarships = await Testtun.find({}).exec()
    res.redirect('/scrapper/result')
    // console.log('insert success!!')
})
// axios.get(url)
//     .then(res => {
//         const $ = cheerio.load(res.data)
//         $('.std-boxproject').each((index, element) => {
//             const sname = $(element).find('.std-ph-font').text().trim()
//             const shref = $(element).find('.std-p-four').attr('href')
//             let sfaculty = $(element).find('.clear_after > .sc-data-y1-b').text().split()
//             sfaculty = sfaculty.join('').replace(/\n/g, ',').replace(/\s+/g, '').replace(/\,,/g,',').replace(/\อื่นๆ/g, '').replace(/\more/g, '').replace(/\,,/g,',')
//             let sclass = $(element).find('.std-p-tree2 > ul > li').text().replace(/\s\s+/g, '')
//             let stest = $(element).find('.std-p-tree3 > ul >li').text().replace(/\s\s+/g, '')
//             let opendate = $(element).find('.std-pt-font').text().replace(/\s\s+/g, '')
//                 // axios.get(shref).then(resp => {
//                 //     const $$ = cheerio.load(resp.data)
//                 //     let sfaculty = $$('ul.clear_after').attr('sc-data-y1-b > p')
//             console.log(sname)
//             console.log(shref)
//             console.log(sfaculty)
//             console.log(sclass)
//             console.log(stest)
//             console.log(opendate)
//             console.log('******************************************************************************************\n')
//                 // })
//         });
//     }).catch(err => console.error(err));



module.exports = router;


// let body = JSON.stringify({
//     sname: sname, 
//     // client_secret: 'secret', 
//     // code: 'abcdef'
// });
// request(
//     {
//         method: 'POST',
//         url: 'http://localhost:3000/scrapper/insert',
//         headers: {'content-type' : 'application/x-www-form-urlencoded'},
//         body: body,
// })