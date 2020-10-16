const fs = require('fs'); //core node module - filesystems module

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json); //contains laptop obj's

// Creating a server
const http = require('http');
const url = require('url'); //url module

const server = http.createServer((req, res) => {
    console.log('Someone accessed the server');
    // Parsing the url
    const pathName = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;
    const id = url.parse(req.url, true).query.id;

    console.log(pathName); //  returns: /laptops
    console.log(query); // returns: { id: '5' }

    //PRODUCT OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' }); // 200:
        fs.readFile(
            `${__dirname}/templates/template-overview.html`,
            'utf-8',
            (err, data) => {
                let overviewOutput = data;

                fs.readFile(
                    `${__dirname}/templates/template-card.html`,
                    'utf-8',
                    (err2, data2) => {
                        const cardsOutput = laptopData
                            .map(e => replaceTemplate(data2, e))
                            .join('');
                        overviewOutput = overviewOutput.replace(
                            '{%CARD%}',
                            cardsOutput
                        );
                        res.end(overviewOutput);
                    }
                );
            }
        );

        //LAPTOP DETAILS
    } else if (pathName === '/laptops' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' }); //200=OK
        fs.readFile(
            `${__dirname}/templates/template-laptop.html`,
            'utf-8',
            (err, data) => {
                const laptop = laptopData[id];
                const output = replaceTemplate(data, laptop);
                res.end(output);
            }
        );
        // IMAGEs
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        });

        //URL NOT FOUND
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' }); // 200:
        res.end('this page was not found on the server');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('server started listening');
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}
