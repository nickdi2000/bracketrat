<template>
    <div class="alert" :class="messageClass" role="alert" v-if="message">
        {{  message }}
    </div>
</template>

<script>
export default {
    name: 'Error',
    props: {
        message: {
            type: String,
            required: true,
            default: ""
        },
        messageClass: {
            type: String,
            default: 'alert-danger'
        }   
    }
}
</script>