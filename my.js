// PERMISSION BUTTON
var btn_reqPermission = document.getElementById("btn_reqPermission")
btn_reqPermission.addEventListener("click", () => { this.checkMotionPermission() })


// ON PAGE LOAD
this.checkMotionPermission()


// FUNCTIONS
async function checkMotionPermission() {

    // Any browser using requestPermission API
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {

        // If previously granted, user will see no prompts and listeners get setup right away.
        // If error, we show special UI to the user.
        // FYI, "requestPermission" acts more like "check permission" on the device.
        await DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
            if (permissionState == 'granted') {
                alert('Granted!');
                // Hide special UI; no longer needed
                btn_reqPermission.style.display = "none"
                this.setMotionListeners()
            }
        })
        .catch( (error) => {
            alert('Error getting sensor permission!');
            console.log("Error getting sensor permission: %O", error)
            // Show special UI to user, suggesting they should allow motion sensors. The tap-or-click on the button will invoke the permission dialog.
            // btn_reqPermission.style.display = "block"
        })

    // All other browsers
    } else {
        this.setMotionListeners()
    }

}

async function setMotionListeners() {

    // ORIENTATION LISTENER
    await window.addEventListener('orientation', event => {
        console.log('Device orientation event: %O', event)
    })

    // MOTION LISTENER
    await window.addEventListener('devicemotion', event => {
        console.log('Device motion event: %O', event)

        // SHAKE EVENT
        // Using rotationRate, which essentially is velocity,
        // we check each axis (alpha, beta, gamma) whether they cross a threshold (e.g. 256).
        // Lower = more sensitive, higher = less sensitive. 256 works nice, imho.
        if ((event.rotationRate.alpha > 256 || event.rotationRate.beta > 256 || event.rotationRate.gamma > 256)) {
            this.output_message.innerHTML = "SHAKEN!"
            setTimeout(() => {
                this.message.innerHTML = null
            }, "2000")
        }
    })
}