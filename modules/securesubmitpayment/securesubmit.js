/**
 * Function to handle the form submission
 */
$(document).ready(function() {

	if ($('.securesubmit-payment-errors').text().length > 0) {
		$('.securesubmit-payment-errors').show();
	}

	$('#securesubmit-payment-form').submit(function(event) {

		$('.securesubmit-payment-errors').hide();
		$('#securesubmit-payment-form').hide();
		$('#securesubmit-ajax-loader').show();
		$('.securesubmit-submit-button').attr('disabled', 'disabled'); /* Disable the submit button to prevent repeated clicks */

		SecureSubmitPayment.generateToken({
			key: securesubmit_public_key,
			card: {
				number: $(".securesubmit-card-number").val(),
				cvc: $(".securesubmit-card-cvc").val(),
				expMonth: $(".securesubmit-card-expiry-month").val(),
				expYear: $(".securesubmit-card-expiry-year").val()
			}
		}, securesubmitResponseHandler);

		return false; /* Prevent the form from submitting with the default action */
	});

});

/**
 * Function to handle the response from SecureSubmit's tokenization call.
 */

function securesubmitResponseHandler(data) {
	if (data.error) {
		var errorMessages = {
			'card.number': 'The credit card number you entered is invalid.',
			'card.expYear': 'The expiry year on the credit card is invalid.'
		};

		// Show any validation errors
		if (data.error.code == "validation") {
			var fieldErrors = data.error.fieldErrors,
				fieldErrorsLength = fieldErrors.length,
				errorList = "";

			for (var i = 0; i < fieldErrorsLength; i++) {
				errorList += "<div>" + errorMessages[fieldErrors[i].field] +
					" " + fieldErrors[i].message + ".</div>";
			}
			// Display the errors
			$('.securesubmit-payment-errors').html(errorList);
			$('.securesubmit-payment-errors').show();
		}
		// Re-enable the submit button
		$('.securesubmit-submit-button').removeAttr('disabled');
		$('#securesubmit-payment-form').show();
		$('#securesubmit-ajax-loader').hide();
	} else {
		// Insert the token into the form so it gets submitted to the server
		$('#securesubmit-payment-form').append('<input type="hidden" name="securesubmitToken" value="' + data['id'] + '" />');
		// Submit the form to the server
		$('#securesubmit-payment-form').get(0).submit();
	}

}