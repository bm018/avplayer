(
	{
		player_loading: function (params) {
			console.log("PIXEL => player_loading (" + (params ? " " + JSON.stringify(params) + " " : "") + ") ");
		},

		stream_load: function (params) {
			console.log("PIXEL => stream_load (" + (params ? " " + JSON.stringify(params) + " " : "") + ") ");
		},

		super_play: function (params) {
			console.log("PIXEL => super_play (" + (params ? " " + JSON.stringify(params) + " " : "") + ") ");
		},

		super_pause: function (params) {
			console.log("PIXEL => super_pause (" + (params ? " " + JSON.stringify(params) + " " : "") + ") ");
		},

		super_volume_change: function (params) {
			console.log("PIXEL => super_volume_change (" + (params ? " " + JSON.stringify(params) + " " : "") + ") ");
		}

	}
)