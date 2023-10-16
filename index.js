const fs = require("fs");
const path = require("path");
const cr2Raw = require("cr2-raw");

const inputFolder = "./Images/ToConvert";
const outputFolder = "./Images/Converted";

// Read the input folder and convert all CR2 files to PNG
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error(`Error reading the input folder: ${err.message}`);
  } else {
    const cr2Files = files.filter(
      (file) => path.extname(file).toLowerCase() === ".cr2"
    );
    cr2Files.forEach((cr2File) => {
      const cr2FilePath = path.join(inputFolder, cr2File);
      console.log("Processing:", cr2FilePath);
      convertCR2toPNG(cr2FilePath);
    });
  }
});

const convertCR2toPNG = (cr2FilePath) => {
  const outputFileName = path.basename(cr2FilePath, path.extname(cr2FilePath)) + ".png";
  var raw = cr2Raw(cr2FilePath);
  fs.writeFileSync(`${outputFolder}/${outputFileName}`, raw.previewImage());
};
