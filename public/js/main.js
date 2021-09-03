function openStream() {
    const config = {
        audio: false,
        video: true
    };
    return navigator.mediaDevices.getUserMedia(config);
}
//
function playStream(isVideoTag, stream) {
    const video = document.getElementById(isVideoTag);
    video.srcObject = stream;
    video.play();
}

const peer = new Peer();
peer.on('open', id => $('#my-peer').append(id));

$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('local-video', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remote-video', remoteStream));
            document.getElementById('video-call-div').style.display = 'block';
        });
});

peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('local-video', stream);
            call.on('stream', remoteStream => playStream('remote-video', remoteStream));
            document.getElementById('video-call-div').style.display = 'block';
        });
});
//sign up
$('#btnCall').click(() => {
    const username = $('#txtusername').val();
    socket
})