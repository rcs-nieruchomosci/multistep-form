<!-- Multistep Conditional Logic & Field Visibility -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    var msfWrapper = document.querySelector('[data-form="multistep"]');
    var steps = msfWrapper.querySelectorAll('[data-form="step"]');
    var currentIndex = 0;
    var chosenLogicStep = null;

    var originalDisplays = [];
    for (var i = 0; i < steps.length; i++) {
        originalDisplays.push(getComputedStyle(steps[i]).display);
    }

    function initializeForm() {
        for (var i = 1; i < steps.length; i++) {
            steps[i].style.display = "none";
        }
        initializeConditionalFields();  // This is where you call the function
    }

    function initializeConditionalFields() {
        var conditionalFields = msfWrapper.querySelectorAll('[data-conditional-value]');
        conditionalFields.forEach(function(field) {
            field.style.display = 'none';
        });

        var checkboxes = msfWrapper.querySelectorAll('input[type="checkbox"][data-conditional-name]');
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                var conditionalName = checkbox.getAttribute('data-conditional-name');
                var correspondingField = msfWrapper.querySelector('[data-conditional-value="' + conditionalName + '"]');
                if (correspondingField) {
                    correspondingField.style.display = '';
                }
            }
        });
    }

    function areRequiredFieldsFilled(step) {
        var requiredInputs = step.querySelectorAll('input[required], select[required]');
        
        for (var i = 0; i < requiredInputs.length; i++) {
            if (requiredInputs[i].tagName === "SELECT" && (requiredInputs[i].value === "" || requiredInputs[i].selectedIndex === 0)) {
                return false;
            } else if (requiredInputs[i].tagName === "INPUT" && !requiredInputs[i].value.trim()) {
                return false;
            }
        }
        return true;
    }

    function areRequiredCheckboxesChecked(step) {
        var requiredCheckboxCount = parseInt(step.getAttribute('data-checkbox'), 10) || 0;
        console.log("Required checkboxes:", requiredCheckboxCount); // Debugging

        if (requiredCheckboxCount <= 0) return true;

        var checkedBoxes = step.querySelectorAll('input[type="checkbox"]:checked').length;
        console.log("Checked boxes:", checkedBoxes); // Debugging

        return checkedBoxes >= requiredCheckboxCount;
    }

    function updateConditionalFieldsVisibility(step) {
        var checkboxes = step.querySelectorAll('input[type="checkbox"][data-conditional-name]');
        checkboxes.forEach(function(checkbox) {
            var conditionalName = checkbox.getAttribute('data-conditional-name');
            var correspondingFields = step.querySelectorAll('[data-conditional-value="' + conditionalName + '"]');
            
            correspondingFields.forEach(function(field) {
                if (checkbox.checked) {
                    field.style.display = '';
                } else {
                    field.style.display = 'none';
                    if(field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
                        field.value = '';  // Clearing value if not displayed
                    }
                }
            });
        });
    }

    initializeForm();

    msfWrapper.addEventListener('change', function(event) {
        var target = event.target;

        if (target.getAttribute('data-conditional-name')) {
            updateConditionalFieldsVisibility(steps[currentIndex]);
        }

        if (target.type !== 'checkbox') {
            return;
        }

        var logicNextStep = target.getAttribute('data-logic-next-step');
        if (logicNextStep) {
            chosenLogicStep = logicNextStep;
        }
    });

    msfWrapper.addEventListener('click', function(event) {
        var target = event.target;

        if (target.getAttribute('data-form') === 'next-btn') {
            if (!areRequiredFieldsFilled(steps[currentIndex]) || !areRequiredCheckboxesChecked(steps[currentIndex])) {
                alert("Zanim przejdziesz dalej, wypełnij wszystkie wymagane pola.");
                return;
            }

            steps[currentIndex].style.display = "none";
            currentIndex++;

            while (steps[currentIndex].hasAttribute('data-step-number') && steps[currentIndex].getAttribute('data-step-number') !== chosenLogicStep) {
                currentIndex++;
            }

            if (currentIndex < steps.length) {
                steps[currentIndex].style.display = originalDisplays[currentIndex];
            }
        }

        if (target.getAttribute('data-form') === 'back-btn') {
            steps[currentIndex].style.display = "none";
            currentIndex--;

            while (currentIndex >= 0 && steps[currentIndex].hasAttribute('data-step-number') && steps[currentIndex].getAttribute('data-step-number') !== chosenLogicStep) {
                currentIndex--;
            }

            if (currentIndex >= 0) {
                steps[currentIndex].style.display = originalDisplays[currentIndex];
            }
        }

        if (target.getAttribute('data-form') === 'submit-btn') {
            if (areRequiredFieldsFilled(steps[currentIndex])) {
                console.log("Form submitted");
            } else {
                alert("Przed przesłaniem formularza prosimy o wypełnienie wszystkich wymaganych pól.");
            }
        }
    });
});
</script>
