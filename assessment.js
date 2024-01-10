const fetch = require("node-fetch");
const users = require('./users.json');
const original = require('./original.json');
const comments = require('./comments.json');
const requestData = require('./request.json');

const token = "";

const keys = {
  keyInitiative: "Inisiatif, Proaktif, Bertanggung jawab",
  keyEnglish: "Bahasa Inggris",
  keySoftSkill: "Tugas Soft Skill",
  keyCareer: "Penyiapan Karier atau startup",
  keyReview: "Review Materi",
  keyReflection: "Refleksi diri",
  keyGoogleIT: "Google IT Automation with Python",
  keyMLProject: "Structuring Machine Learning Projects",
  keyCapstone: "Capstone Project / Proyek Akhir",
  keyMathML: "Mathematics for Machine Learning and Data Science Specialization",
  keyMLAndrew: "Machine Learning Specialization by Andrew Ng",
  keyDataAnalytics: "Google Data Analytics",
  keyTSDataDeploy: "DeepLearning.AI Tensorflow Data and Deployment",
  keyTSCertificate: "DeepLearning.AI TensorFlow Developer Professional Certificate",
  keyTFDC: "Simulasi Ujian TensorFlow Developer Certificate"
};

async function main() {

  const requests = [];

  original.forEach((original, index) => {
    let user = users.find(user => user.id_reg_penawaran === original["ID Kampus Merdeka"].toString());
    if (!user) {
      return;
    }

    let data = JSON.parse(JSON.stringify(requestData));
    data.scores.forEach((score, index) => {
      Object.keys(keys).forEach((key, index) => {
        if (score.module_name === keys[key]) {
          score.score = original[keys[key]];
          score.comment = getComment(keys[key], original[keys[key]]);
        }
      });
    });

    // ! assessment
    // ! final_assessment

    requests.push({
      url: "https://api.kampusmerdeka.kemdikbud.go.id/v1alpha1/mentors/me/mentees/" + user.id + "/activities/" + user.activity_id + "/final_assessment",
      body: JSON.stringify(data),
    });
  });

  function getValueRate(value) {
    if (value >= 70 && value <= 100) {
      return "High";
    } else if (value >= 40) {
      return "Low";
    } else {
      return "Lowest";
    }
  }

  function getComment(key, value) {
    let comment = comments.find(comment => comment["Course List"] === key);
    if (!comment) {
      return;
    }
    let rate = getValueRate(value);
    console.log(key, value, rate);
    return comment[rate];
  }

  for (let i = 0; i < requests.length; i++) {
    let request = requests[i];
    console.log(request.url);
    console.log(JSON.parse(request.body));
  }

  for (let i = 0; i < requests.length; i++) {
    let request = requests[i];
    await fetch(request.url, {
      "headers": {
        "accept": "application/json",
        "authorization": "Bearer " + token,
        "Referer": "https://mentor.kampusmerdeka.kemdikbud.go.id/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": request.body,
      "method": "POST"
    });
  }
}

main();