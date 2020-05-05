<template>
  <v-row justify="center">
    <v-btn v-on:click="addBook = true" class="ma-2" outlined color="orange">
      Add Book
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="addBook" persistent max-width="750px">
      <v-card>
        <v-card-title>
          <span class="headline grey--text text--darken-2">Add Book</span>
        </v-card-title>
        <v-card-text class="text-left text-light condensed">
          <v-row>
            <v-col cols="6" sm="4" md="3">
              <v-img v-bind:src="book.image"></v-img>
            </v-col>
            <v-col cols="6" sm="8" md="9">
              <v-text-field v-model="book.isbn" v-on:change.native="searchBookExt" label="ISBN"></v-text-field>
              <v-text-field label="Title*" v-model="book.title"></v-text-field>
              <div v-for="(author, index) in book.authors" v-bind:key="index">
                <v-text-field label="Author*" v-model="author.name"></v-text-field>
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
                label="Location*"
              />
            </v-col>
            <v-col cols="2">
              <v-btn v-on:click="addLocation = true" class="ma-3" outlined color="orange">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text v-on:click="addBook = false">Close</v-btn>
          <v-btn color="blue darken-1" text v-on:click="saveBook">Save</v-btn>
        </v-card-actions>
      </v-card>

      <v-alert :type="alert.type" v-model="alert.visible" dismissible>{{alert.message}}</v-alert>
    </v-dialog>
    <v-dialog v-model="addLocation" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline grey--text text--darken-2">Add Location</span>
        </v-card-title>
        <v-card-text class="text-left text-light condensed">
          <v-row>
            <v-col cols="6" sm="8" md="9">
              <v-text-field label="Description*" v-model="location.name" required></v-text-field>
            </v-col>
            <v-col cols="2" required>
              <v-radio-group v-model="typeLocation">
                <v-radio label="Shelf" value="1"></v-radio>
                <v-radio label="Box" value="2"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text v-on:click="addLocation = false">Close</v-btn>
          <v-btn color="blue darken-1" text v-on:click="saveLocation">Save</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert :type="alert2.type" v-model="alert2.visible" dismissible>{{alert2.message}}</v-alert>
    </v-dialog>
  </v-row>
</template>

<script>
import Book from "@/services/books";
import Location from "@/services/locations";
import Shelf from "@/services/shelves";
import Box from "@/services/boxes";

export default {
  props: {
    addBook: Boolean
  },
  data: () => ({
    addLocation: false,
    location: {
      name: ""
    },
    descriptionLimit: 30,
    disableFields: false,
    refreshLocations: false,
    locations: {
      id: 0,
      name: ""
    },
    loading: false,
    searchLocations: null,
    typeLocation: "1",
    box: {
      name: ""
    },
    shelf: {
      name: ""
    },
    alert: {
      type: "",
      message: "",
      visible: false
    },

    alert2: {
      type: "",
      message: "",
      visible: false
    },
    rules: {
      titleValid: true,
      authorValid: true,
      locationValid: true
    },
    book: {
      isbn: "",
      title: "",
      pages: "",
      image: "",
      authors: [{ name: "" }],
      location: {
        id: 0,
        name: ""
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
    }
  },
  methods: {
    saveBook() {
      if (this.validateBook()) {
        Book.save(this.book)
          .then(response => {
            if (response.data) {
              this.Message("success", "Book saved successfully");
              this.clearBook();
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.Message("error", "The required fields were not informed");
      }
    },
    saveLocation() {
      if (this.validateLocation()) {
        if (this.typeLocation == 1) {
          (this.shelf = this.location),
            Shelf.save(this.shelf)
              .then(response => {
                this.MessageLocation("succes", "Location added susccefully");
                (this.book.location = response.data),
                  (this.addLocation = false),
                  (this.refreshLocations = true);
              })
              .catch(error => {
                console.log(error);
              });
          this.addLocation = false;
        } else if (this.typeLocation == 2) {
          (this.box = this.location),
            Box.save(this.box)
              .then(response => {
                (this.book.location = response.data),
                  (this.addLocation = false),
                  (this.refreshLocations = true);
              })
              .catch(error => {
                console.log(error);
              });
        }
      } else {
        this.MessageLocation("error", "The required fields were not informed"); 
      }
    },

    Message(type, message) {
      (this.alert.visible = true),
        (this.alert.type = type),
        (this.alert.message = message);
    },
    MessageLocation(type, message) {
      (this.alert2.visible = true),
        (this.alert2.type = type),
        (this.alert2.message = message);
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
    },
    validateBook: function() {
      (this.rules.titleValid = this.book.title.length > 0),
        (this.rules.authorValid = this.book.authors.length > 0),
        (this.rules.locationValid = this.book.location.name.length > 0);

      return (
        this.rules.titleValid &&
        this.rules.authorValid &&
        this.rules.locationValid
      );
    },
    validateLocation: function() {
      return (
        this.location.name.length > 0
      );
    },
    clearBook() {
      (this.book.isbn = ""),
        (this.book.title = ""),
        (this.book.pages = ""),
        (this.book.image = ""),
        (this.authors = [{ name: "" }]),
        (this.location = {
          id: 0,
          name: ""
        });
    }
  },
  mounted() {
    this.clearBook,
      (this.book.image =
        "https://cdn4.iconfinder.com/data/icons/for-your-interface-free-samples/128/Book-512.png");
  }
};
</script>
