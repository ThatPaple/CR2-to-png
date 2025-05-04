const fs = require("fs");
const path = require("path");
const cr2Raw = require("cr2-raw");
const { Jimp } = require("jimp");
const args = require('args-parser')(process.argv);

const inputFolder = "./Images/ToConvert";
const outputFolder = "./Images/Converted";

// Read the input folder and convert all CR2 files to PNG
const main = async () => {
  const files = fs.readdirSync(inputFolder);

  const cr2Files = files.filter((file) => path.extname(file).toLowerCase() === ".cr2");

  const promises = [];

  for (const file of cr2Files) {
    const cr2FilePath = path.join(inputFolder, file);
    console.log("Processing:", cr2FilePath);
    promises.push(convertCR2toPNG(cr2FilePath));
  }

  await Promise.all(promises);
}

// Rotate image using jimp
const rotateImage = async (input) => {
  return new Promise((resolve, reject) => {
    Jimp.read(input).then(img => {
      img.rotate(90)
      img.getBuffer("image/png").then(buff => resolve(buff));
    }).catch(err => reject(err));
  });
}

const convertCR2toPNG = async (cr2FilePath) => {
  const outputFileName = path.basename(cr2FilePath, path.extname(cr2FilePath)) + ".png";
  var raw = cr2Raw(cr2FilePath).previewImage();
  const outputPath = `${outputFolder}/${outputFileName}`;

  if (args.rotate && args.rotate > 0) raw = await rotateImage(raw)

  fs.writeFileSync(outputPath, raw);
  console.log("Processed and written: ", outputFileName);
};

main(); 