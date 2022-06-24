// TODO: 이 곳에 정답 코드를 작성해주세요.
import Stopwatch from './stopwatch.js';

const stopwatch = new Stopwatch();

let isRunning = false;
let interval;
let $minLap, $maxLap;

const $timer = document.getElementById('timer');
const $startStopBtn = document.getElementById('start-stop-btn');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $laps = document.getElementById('laps');

const FormatString = (num) => (num < 10 ? `0${num}` : num);
const FormatTime = (time) => {
    let formattedString = '';
    const min = parseInt(time / 6000);
    const sec = parseInt((time % 6000) / 100);
    const cs = time % 100;
    formattedString = `${FormatString(min)}:${FormatString(sec)}:${FormatString(
        cs
    )}`;
    return formattedString;
};

const updateTimer = (time) => {
    $timer.innerText = FormatTime(time);
};
const toggleBtn = () => {
    $startStopBtn.classList.toggle('bg-green-600');
    $startStopBtn.classList.toggle('bg-red-600');
};
const onClickStartBtn = () => {
    stopwatch.start();
    interval = setInterval(() => {
        updateTimer(stopwatch.centisecond);
    }, 10);
    $startStopBtnLabel.innerText = '중지';
    $lapResetBtnLabel.innerText = '랩';
};

const onClickStopBtn = () => {
    stopwatch.pause();
    clearInterval(interval);
    $startStopBtnLabel.innerText = '시작';
    $lapResetBtnLabel.innerText = '리셋';
};

const colorMinMax = () => {
    $minLap.classList.add('text-green-600');
    $maxLap.classList.add('text-red-600');
};

const onClickLapBtn = () => {
    const [lapCount, lapTime] = stopwatch.createLap();
    const $lap = document.createElement('li');
    $lap.setAttribute('data-time', lapTime);
    // const $lapCount = document.createElement('span');
    // const $lapTime = document.createElement('span');

    $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
    $lap.innerHTML = `
    <span>랩 ${lapCount}</span>
    <span>${FormatTime(lapTime)}</span>`;

    // $lapCount.innerText = lapCount;
    // $lapTime.innerText = lapTime;
    // $lap.appendChild($lapCount);

    $laps.prepend($lap);

    if ($minLap === undefined) {
        $minLap = $lap;
        return;
    }
    if ($maxLap === undefined) {
        if ($minLap.dataset.time > lapTime) {
            $maxLap = $minLap;
            $minLap = $lap;
        } else {
            $maxLap = $lap;
        }

        colorMinMax();
        return;
    }
    if (lapTime > $maxLap.dataset.time) {
        $maxLap.classList.remove('text-red-600');
        $maxLap = $lap;
    } else if (lapTime < $minLap.dataset.time) {
        $minLap.classList.remove('text-green-600');
        $minLap = $lap;
    }

    colorMinMax();
};

const onClickResetBtn = () => {
    stopwatch.reset();
    updateTimer(0);
    $laps.innerHTML = ' ';
    $maxLap = undefined;
    $minLap = undefined;
};
const onClickLapResetBtn = () => {
    if (isRunning) {
        onClickLapBtn();
    } else {
        onClickResetBtn();
    }
};

const onClickStartStopBtn = () => {
    if (isRunning) {
        onClickStopBtn();
    } else {
        onClickStartBtn();
    }
    toggleBtn();
    isRunning = !isRunning;
};

const onKeyDown = (e) => {
    switch (e.code) {
        case 'KeyS':
            onClickStartStopBtn();
            break;
        case 'KeyL':
            onClickLapResetBtn();
            break;
    }
};
$startStopBtn.addEventListener('click', onClickStartStopBtn);
$lapResetBtn.addEventListener('click', onClickLapResetBtn);

document.addEventListener('keydown', onKeyDown);
