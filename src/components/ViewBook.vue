<template>
  <v-row justify="center">
    <v-dialog v-model="viewBook" persistent max-width="750px">
      <v-card>
        <v-card-title>
          <span class="headline grey--text text--darken-2"></span>
        </v-card-title>
        <v-card-text class="text-left text-light condensed">
          <v-row>
            <v-col cols="6" sm="4" md="3">
              <v-img v-bind:src="book.image"></v-img>
            </v-col>
            <v-col cols="6" sm="8" md="9">
              <v-text-field
                v-model="book.isbn"
                v-on:change.native="searchBookExt"
                label="ISBN"
                required
              ></v-text-field>
              <v-text-field label="Title" v-model="book.title" required></v-text-field>
              <div v-for="(author, index) in book.authors" v-bind:key="index">
                <v-text-field label="Author" v-model="author.name"></v-text-field>
              </div>
              <v-text-field label="Pages" v-model="book.pages" type="number"></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-autocomplete
                v-model="book.location"
                :loading="loading"
                :items="locations"
                item-text="name"
                item-value="id"
                :search-input.sync="searchLocations"
                no-filter
                hide-no-data
                clearable
                return-object
                label="Location"
                required
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-col cols="6">
            <v-rating v-model="book.ratings.stars" background-color="orange" color="orange" medium></v-rating>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text v-on:click="$emit('update:viewBook', false)">Close</v-btn>
          <v-btn color="blue darken-1" text v-on:click="saveBook">Save</v-btn>
        </v-card-actions>
      </v-card>
       <v-alert :type="alert.type" v-model="alert.visible" dismissible>{{alert.message}}</v-alert>
    </v-dialog>
  </v-row>
</template>

<script>
import Book from "@/services/books";
import Location from "@/services/locations";

export default {
  props: {
    viewBook: Boolean,
    bookParent: Object
  },
  data: () => ({
    alert: {
      type: "",
      message: "",
      visible: false
    },
    location: {
      name: ""
    },
    refreshLocations: false,
    locations: {
      id: 0,
      name: ""
    },
    loading: false,
    searchLocations: null,
    book: {
      isbn: "",
      title: "",
      pages: "",
      image: "",
      lastViewd: "",
      authors: [{ name: "" }],
      location: {
        id: 0,
        name: ""
      },
      ratings: {
        user: {
          id: 1,
          name: "Guest"
        },
        stars: 0
      }
    }
  }),

  watch: {
    searchLocations(val) {
      if (this.locations.length > 0 && !this.refreshLocations) return;
      if (this.loading) return;
      if (val == null) return;
      this.loading = true;
      Location.list()
        .then(response => {
          this.locations = response.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(
          () => ((this.loading = false), (this.refreshLocations = false))
        );
    },
    viewBook() {
      if (this.viewBook) {
        this.book = Object.assign({}, this.bookParent);
        this.book.ratings.user = Object.assign({}, this.user);
        var currentDate = new Date();
        this.book.lastViewd = currentDate;
        this.saveBook();
      }
    }
  },
  methods: {
    saveBook(message) {
      this.book.ratings.user.id = 1;
      Book.update(this.book)
        .then(response => {
          if (response.data) {
            if (message){
            this.Message("success", "Book successfully updated");
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveAndClose() {
      this.saveBook();
      this.$emit("update:viewBook", false);
    },
    Message(type, message) {
      (this.alert.visible = true),
        (this.alert.type = type),
        (this.alert.message = message);
    },
    searchBook() {
      Book.listById(this.props.bookId).then(response => {
        this.book = response.data;
      });
    },

    searchBookExt() {
      Book.extSearchISBN(this.book.isbn).then(response => {
        (this.book.title = response.data.book.title),
          (this.book.pages = response.data.book.pages),
          (this.book.image = response.data.book.image);

        if (response.data.book.authors.length > 0) {
          (this.book.authors = []),
            response.data.book.authors.forEach(item => {
              var author = new Object();
              author.name = item;
              this.book.authors.push(author);
            });
        }
      });
    }
  },
  mounted() {
    this.alert.visible= false,
    Location.list()
      .then(response => {
        this.locations = response.data;
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => ((this.loading = false), (this.refreshLocations = false)));
  }
};
</script>
