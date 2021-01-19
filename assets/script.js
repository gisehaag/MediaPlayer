class MediaPlayer {
	constructor(id) {

		this.videoWrapper = document.querySelector(id);

		this.video = this.videoWrapper.querySelector('video');
		this.controls = this.videoWrapper.querySelector('.controls');

		this.playPauseButton = this.controls.querySelector('.toggle');
		this.volumeIcon = this.controls.querySelector('.volume');
		this.volumeInput = this.controls.querySelector('#volume-range');
		this.backwardButton = this.controls.querySelector('.backward__button');
		this.progressRange = this.controls.querySelector('#progress-control');
		this.forwardButton = this.controls.querySelector('.forward__button');
		this.playerControl = this.controls.querySelectorAll('.player__control');
		this.displayVideoDuration = this.controls.querySelector('#duration');
		this.displayProgress = this.controls.querySelector('#progress');

		this.INIT_VOLUME = 0.3;
		this.video.volume = this.INIT_VOLUME;
		this.preVolume = this.video.volume;

		this.addEvents();
		this.videoPlayer();

	}

	addEvents() {
		// Acá a los metodos los paso con bind porque intersa que el this sea la clase MediaPlayer y no quien los llamó.
		this.playPauseButton.addEventListener('click', this.togglePlayPauseButton.bind(this));

		this.volumeIcon.addEventListener('click', this.muteVideo.bind(this));
		this.volumeInput.addEventListener('input', this.volumeController.bind(this));

		this.video.addEventListener('timeupdate', this.videoPlayer.bind(this));
		this.progressRange.addEventListener('input', this.setCurrentTime.bind(this));

		this.playerControl.forEach((button) => {
			button.addEventListener('click', this.playerController.bind(this));
		});
	}

	transformToMinutesAndSeconds(time) {
		let timeInMinutes = parseInt(time / 60);
		let timeSeconds = Math.round(time % 60);
		if (timeSeconds < 10) {
			timeSeconds = `0${timeSeconds}`;
		}

		return `${timeInMinutes}:${timeSeconds}`;
	}

	playerController(e) {
		let buttonPressed = e.currentTarget;
		let buttonPressedClasses = buttonPressed.classList.value;
		let GAP = 30;

		if (buttonPressedClasses.includes('backward')) {
			this.video.currentTime -= GAP;
		} else if (buttonPressedClasses.includes('forward')) {
			this.video.currentTime += GAP;
		}
	}

	togglePlayPauseButton() {
		this.iconClass = this.playPauseButton.querySelector('i').classList;

		if (this.iconClass.contains('fa-play')) {
			this.iconClass.replace('fa-play', 'fa-pause');
			this.video.play();
			this.videoWrapper.classList.add('playing');
		} else {
			this.iconClass.replace('fa-pause', 'fa-play');
			this.video.pause();
			this.videoWrapper.classList.remove('playing');
		}
	}

	volumeController() {
		this.settedVolume = this.volumeInput.value;
		this.volumePercent = this.settedVolume / 100;

		this.video.volume = this.volumePercent;
		this.video.muted = (this.video.volume == 0) ? true : false;

		this.changeVolumeIcon();
	}

	changeVolumeIcon() {
		this.icon = this.volumeIcon.querySelector('i');
		this.iconClass = this.icon.classList;
		this.volume = this.video.volume;

		this.icon.setAttribute('class', 'fas');
		if (this.volume == 0) {
			this.iconClass.add('fa-volume-mute');
		} else if (this.volume < 0.5) {
			this.iconClass.add('fa-volume-down');
		} else {
			this.iconClass.add('fa-volume-up');
		}
	}

	muteVideo() {
		if (!this.video.muted) {
			this.preVolume = this.video.volume;
			this.video.volume = 0;
			this.volumeInput.value = 0;
		} else {
			this.video.volume = this.preVolume;
			this.volumeInput.value = this.preVolume * 100;
		}

		this.video.muted = !this.video.muted;

		this.changeVolumeIcon();
	}

	changeToMuteButton() {
		this.iconClass = volumeIcon.querySelector('i').classList;
		this.iconClass.toggle('fa-volume-mute');
	}

	videoPlayer() {
		let maxRange = this.video.duration;
		this.progressRange.setAttribute('max', maxRange);
		this.progressRange.value = this.video.currentTime;
		this.displayProgress.innerHTML = `${(this.transformToMinutesAndSeconds(this.video.currentTime))} / `;
		this.displayVideoDuration.innerHTML = (this.transformToMinutesAndSeconds(this.video.duration));
	}

	setCurrentTime() {
		let settedCurrentTime = this.progressRange.value;
		this.video.currentTime = settedCurrentTime;
	}

}

let player = new MediaPlayer('#video-1');




















