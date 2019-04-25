describe('Should call progress', function () {
  it('is a function', async function () {
    const prs = new PRS({
      env: 'env',
      debug: true,
      privateKey: '2b8b3ef68fa54d1af878063541e629e62b22764ab58400a3423d778bc0949b9a',
      address: '86248535534919506cc130b21a32383cf36c5b6a'
    });

    const fileInput = document.getElementById('fileInput');
    let formObj = {
      title: 'test title',
      file: fileInput.files[0]
    }

    function onUploadProgress(e) {
      console.log(e)
      const percent = Math.round(100 * e.loaded / e.total);
      console.log(`${e.type}: ${e.loaded}/${e.total} bytes(${percent}%) transferred`)
    }
    function onHashProgress(e) {
      console.log(`hash ${e}`)
    }
    const res = await prs.file.signByFileReader(formObj, onUploadProgress, onHashProgress);
    chai.expect(res.status).to.equal(200);
    chai.expect(res.body).to.have.property('block');
    chai.expect(res.body).to.have.property('cache');
  }).timeout(30000);
});
