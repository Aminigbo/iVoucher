if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/aminigbo/.gradle/caches/8.10.2/transforms/b5c27c9c304c80f67adad6c9c6ebe68c/transformed/jetified-hermes-android-0.76.1-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/aminigbo/.gradle/caches/8.10.2/transforms/b5c27c9c304c80f67adad6c9c6ebe68c/transformed/jetified-hermes-android-0.76.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

