const socket = io('https://stream3012.herokuapp.com/');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const {
            ten,
            peerId
        } = user;
        $('#ulUser').append(`<li id="${peerId}" style="cursor: pointer;">${ten}</li>`);
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const {
            ten,
            peerId
        } = user;
        $('#ulUser').append(`<li id="${peerId}" style="cursor: pointer;">${ten}</li>`);
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));


function openStream() {
    const config = {
        audio: {
            echoCancellation: true
        },
        video: true
    };
    return navigator.mediaDevices.getUserMedia(config);
}

function openScreenStream() {
    const config = {
        audio: true,
        video: true
    };
    return navigator.mediaDevices.getDisplayMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

function endScreenStream(id,stream) {
    openStream()
         .then(stream => {
             playStream('localStream', stream);
             const call = peer.call(id, stream);
             call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
}

function playScreenStream(idVideoTag, stream) {
    const id = $('#remoteId').val();
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
    stream.getVideoTracks()[0].addEventListener('ended', () => {
           endScreenStream(id,stream);
     });
}

// openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({
    key: 'peerjs',
    host: 'mypeer302.herokuapp.com',
    port: 443,
    secure: true
});

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {
            ten: username,
            peerId: id
        });
        document.getElementById('video-call').style.display = 'none';
        $("body").css({
            background: 'linear-gradient(90deg,#49aeff,#ff4c89)'
        });
    });
});

$('#shareScreen').click(() => {
    const id = $('#remoteId').val();
    openScreenStream()
        .then(stream => {
            $('#screenStream').show();
            playStream('screenStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
});
$('#btnStart').click(() => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('div-dang-ky').style.display = 'block';
    $("body").css({
        background: '#000'
    });
});

//Callee
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
            document.getElementById('video-call').style.display = 'block';
            document.getElementById('online').style.display = 'none';
        });
});

$('#ulUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    console.log(id);
    $('#remoteId').val(id);
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
            document.getElementById('video-call').style.display = 'block';
            document.getElementById('online').style.display = 'none';
        });
    
});
